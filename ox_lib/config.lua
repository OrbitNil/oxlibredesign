--[[
    ox_lib menu UI (list menu + context menu)

    menuBannerImage:
      - Use an HTTPS link below, or a file in this resource: nui://RESOURCE_NAME/path/to.png
      - Special characters in URLs (e.g. parentheses in filenames) are handled by the UI.
      - Set to bundled fallback: assign OxLib.menuBannerImage to nil and set defaultBanner to nui, or edit defaultBanner.

    menuTitlePrefix — default text before titles (e.g. '||'); set to '' to hide.
]]

OxLib = OxLib or {}

-- Edit this to your banner URL (https:// or nui://).
local defaultBanner =
    'https://r2.fivemanage.com/6bOfDKDUbz71P2aZ6roWw/ChatGPTImageApr21202601_53_45AM(1).png'

if OxLib.menuBannerImage == nil or OxLib.menuBannerImage == '' then
    OxLib.menuBannerImage = defaultBanner
end

if OxLib.menuTitlePrefix == nil then
    OxLib.menuTitlePrefix = '||'
end

-- Use bundled strip instead of a link:
-- OxLib.menuBannerImage = ('nui://%s/web/images/menu_banner.svg'):format(GetCurrentResourceName())
