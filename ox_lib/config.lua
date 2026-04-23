
OxLib = OxLib or {}
-- UNCOMMENT THESE 4 ROWS TO CUSTOMISE THE UI SETUP
 -- OxLib.primaryColorHex = '#ff3636'
 -- OxLib.secondaryColorHex = '#ffffff'
 -- OxLib.primaryOpacity = 0.80
 -- OxLib.primaryStrength = 70

-- Edit this to your banner URL (https:// or nui://).
local defaultBanner =
    'https://r2.fivemanage.com/6bOfDKDUbz71P2aZ6roWw/ChatGPTImageApr21202601_53_45AM(1).png'

if OxLib.menuBannerImage == nil or OxLib.menuBannerImage == '' then
    OxLib.menuBannerImage = defaultBanner
end

if OxLib.menuTitlePrefix == nil then
    OxLib.menuTitlePrefix = '||'
end
