--[[
    https://github.com/overextended/ox_lib

    This file is licensed under LGPL-3.0 or higher <https://www.gnu.org/licenses/lgpl-3.0.en.html>

    Copyright © 2025 Linden <https://github.com/thelindat>
]]

local _registerCommand = RegisterCommand

---@param commandName string
---@param callback fun(source, args, raw)
---@param restricted boolean?
function RegisterCommand(commandName, callback, restricted)
	_registerCommand(commandName, function(source, args, raw)
		if not restricted or lib.callback.await('ox_lib:checkPlayerAce', 100, ('command.%s'):format(commandName)) then
			callback(source, args, raw)
		end
	end)
end

local defaultTitlePrefix = '||'

local function bundledBannerUrl()
    return ('nui://%s/web/images/menu_banner.svg'):format(GetCurrentResourceName())
end

local function resolveMenuBanner()
    local o = rawget(_G, 'OxLib') or {}
    local url = o.menuBannerImage
    if type(url) == 'string' and url ~= '' then
        return url
    end
    return bundledBannerUrl()
end

local function resolveTitlePrefix()
    local o = rawget(_G, 'OxLib') or {}
    if o.menuTitlePrefix ~= nil then
        return o.menuTitlePrefix
    end
    return defaultTitlePrefix
end

---@param v any
---@return string|nil
local function normalizeHex(v)
    if type(v) ~= 'string' then return nil end
    local s = (v:match('^%s*(.-)%s*$') or '')
    if s == '' then return nil end
    if s:sub(1, 1) ~= '#' then s = '#' .. s end
    return s
end

local function resolvePrimaryColorHex()
    local o = rawget(_G, 'OxLib') or {}
    return normalizeHex(o.primaryColorHex)
end

local function resolveSecondaryColorHex()
    local o = rawget(_G, 'OxLib') or {}
    return normalizeHex(o.secondaryColorHex)
end

--- 0–1 panel alpha scale; also accepts 1–100 as percent (e.g. 85 → 0.85).
---@return number|nil
local function resolvePrimaryOpacity()
    local o = rawget(_G, 'OxLib') or {}
    local v = o.primaryOpacity
    if type(v) ~= 'number' or v ~= v then return nil end
    if v > 1 then v = v / 100 end
    if v < 0 then v = 0 end
    if v > 1 then v = 1 end
    return v
end

--- 0–100: 0 = grey panels, 100 = full saturation of primaryColorHex.
---@return number|nil
local function resolvePrimaryStrength()
    local o = rawget(_G, 'OxLib') or {}
    local v = o.primaryStrength
    if type(v) ~= 'number' or v ~= v then return nil end
    if v < 0 then v = 0 end
    if v > 100 then v = 100 end
    return v
end

RegisterNUICallback('getConfig', function(_, cb)
    cb({
        primaryColor = GetConvar('ox:primaryColor', 'blue'),
        primaryShade = GetConvarInt('ox:primaryShade', 8),
        menuBannerImage = resolveMenuBanner(),
        menuTitlePrefix = resolveTitlePrefix(),
        primaryColorHex = resolvePrimaryColorHex(),
        secondaryColorHex = resolveSecondaryColorHex(),
        primaryOpacity = resolvePrimaryOpacity(),
        primaryStrength = resolvePrimaryStrength(),
    })
end)
