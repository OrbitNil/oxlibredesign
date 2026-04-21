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

RegisterNUICallback('getConfig', function(_, cb)
    cb({
        primaryColor = GetConvar('ox:primaryColor', 'blue'),
        primaryShade = GetConvarInt('ox:primaryShade', 8),
        menuBannerImage = resolveMenuBanner(),
        menuTitlePrefix = resolveTitlePrefix(),
    })
end)
