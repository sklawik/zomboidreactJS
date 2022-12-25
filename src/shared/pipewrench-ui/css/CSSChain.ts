import { CSSRuleset } from './CSS';
import { SelectorBlocks } from './CSSParser';

export class CSSChain {
  readonly links: { [selector: string]: CSSChainLink } = {};

  addBlocks(css: SelectorBlocks) {
    for (const selector of Object.keys(css)) {
      this.getOrCreateLink(selector, new CSSRuleset(css[selector]));
    }
  }

  getOrCreateLink(selector: string, ruleset?: CSSRuleset): CSSChainLink {
    let rules = this.links[selector];
    if (rules != null) return rules;
    rules = new CSSChainLink(selector, ruleset);
    this.links[selector] = rules;
    return rules;
  }
}

export class CSSChainLink {
  readonly subLinks: { [id: string]: CSSChainLink } = {};
  readonly rules: CSSRuleset;
  readonly id: string;
  superLink: CSSChainLink | null = null;

  constructor(id: string, rules?: CSSRuleset) {
    this.id = id;
    this.rules = new CSSRuleset();
    if (rules != null) this.rules.setRules(rules);
  }

  /**
   *
   * @param selector The full CSS selector to
   * @returns
   */
  hasSubLink(selector: string): boolean {
    // TODO: Resolve.
    return false;
  }

  addSubLinks(...subLinks: CSSChainLink[]) {
    if (subLinks.length === 0) return;
    for (const link of subLinks) {
      if (this.isSuperLink(link)) {
        throw new Error(
          `CyclicChainLinkError: Tried to set the parent ChainLink '${link.id}' as the child of '${this.id}.'`
        );
      }
      this.subLinks[link.id] = link;
      link.superLink = this;
    }
  }

  removeSubLinks(...subLinks: CSSChainLink[]) {
    if (subLinks.length === 0) return;
    for (const link of subLinks) {
      if (this.isSubLink(link)) {
        delete this.subLinks[link.id];
        link.superLink = null;
      }
    }
  }

  setSuperLink(superLink: CSSChainLink | null) {
    if (this.superLink != null) this.superLink.removeSubLinks(this);
    this.superLink = superLink;
    if (this.superLink != null) {
      this.superLink.subLinks[this.id] = this;
    }
  }

  isSubLink(link: CSSChainLink): boolean {
    return Object.keys(this.subLinks).indexOf(link.id) !== -1;
  }

  isSuperLink(link: CSSChainLink): boolean {
    if (this.superLink == null) return false;
    return this.superLink === link || this.superLink.isSuperLink(link);
  }

  isRootLink(): boolean {
    return this.superLink == null;
  }
}
