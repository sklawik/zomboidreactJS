local mod = {};

function mod.tPrint(tbl, indent_count, indent_cap)
    if indent == nil then indent = 0 end
    if indent_cap == nil then indent_cap = 4 end
    if indent_count == nil then indent_count = 0 end

    if indent_count >= indent_cap then return '..' end

    local to_print = '{';

    for k, v in pairs(tbl) do
        if (type(k) == 'number') then
            to_print = to_print .. k .. '=';
        elseif (type(k) == 'string') then
            to_print = to_print .. '\'' .. k .. '\'=';
        end

        if (type(v) == 'number') then
            to_print = to_print .. v .. ', ';
        elseif (type(v) == 'string') then
            to_print = to_print .. '\'' .. v .. '\', ';
        elseif (type(v) == 'table') then
            to_print = to_print .. mod.tPrint(v, indent_count + 1, indent_cap) .. ', ';
        else
            to_print = to_print .. tostring(v) .. ', ';
        end
    end

    to_print = string.sub(to_print, 0, string.len(to_print) - 2) .. '}';

    return to_print;
end

-----------------------------------------------------------------
-- @return  Returns a compressed table-array with no null entries.
-----------------------------------------------------------------
function mod.tCompress(t)
    local o = {};
    local p = 0;

    for i, f in ipairs(t) do
        if f ~= nil then
            o[p] = f;
            p = p + 1;
        end
    end

    return o;
end

-----------------------------------------------------------------
-- @table T   The table being examined.
-- @return    Returns the length of the table.
-----------------------------------------------------------------
function mod.tLength(T)
    local count = 0;
    for _ in pairs(T) do count = count + 1 end

    return count;
end

-----------------------------------------------------------------
-- @table T   The table being checked.
-- @string nam  The name being checked.
-- @return    Returns whether or not the Table contains a value with the given name.
-----------------------------------------------------------------
function mod.tContainsKey(T, nam)
    for key, _ in pairs(T) do
        if nam == key then return true end
    end

    return false;
end

-----------------------------------------------------------------
-- @table T   The table being checked.
-- @object val  The value being checked.
-- @return    Returns whether or not the Table contains the given value.
-----------------------------------------------------------------
function mod.tContainsValue(T, val)
    for _, value in pairs(T) do
        if val == value then return true end
    end

    return false;
end

-----------------------------------------------------------------

return mod;
