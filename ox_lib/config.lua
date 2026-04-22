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


