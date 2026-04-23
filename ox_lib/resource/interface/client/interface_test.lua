--[[
    Dev-only commands to exercise ox_lib client / NUI interfaces (F8).

    Master switch (disables this entire file):
        setr ox_lib:interfaceTestCommands 0   (then restart ox_lib)
    Default is 1 (enabled).

    Optional legacy switches (only matter when master is on):
        setr ox_lib:progressTestCommands 0    — skip progress bar / circle tests
        setr ox_lib:minigameTestCommands 0      — skip skill check tests

    Commands —
      Progress:     testoxlibpb  testoxlibpc  testoxlibpcb
      Skill check:  testoxlibsc  testoxlibsc_med  testoxlibsc_hard  testoxlibsc_chain
      Notify:       testoxlibnotify
      TextUI:       testoxlibtextui   testoxlibtextuihide
      Context:      testoxlibctx
      List menu:    testoxlibmenu
      Alert:        testoxlibalert
      Input dialog: testoxlibinput
      Clipboard:    testoxlibclip
      Radial:       testoxlibradial          (adds entries; open with default radial key, usually Z)
]]

if GetConvarInt('ox_lib:interfaceTestCommands', 1) == 0 then return end

local progressOn = GetConvarInt('ox_lib:progressTestCommands', 1) ~= 0
local minigameOn = GetConvarInt('ox_lib:minigameTestCommands', 1) ~= 0

--- Relaxed ProgressProps so progress is not skipped (see progress.lua interrupt checks).
local testProgressOpts = {
    canCancel = true,
    useWhileDead = true,
    allowRagdoll = true,
    allowCuffed = true,
    allowFalling = true,
    allowSwimming = true,
}

-- region Progress

local function runProgressBar()
    lib.progressBar({
        label = 'Progress (ox_lib dev test)',
        duration = 6000,
        canCancel = true,
        useWhileDead = testProgressOpts.useWhileDead,
        allowRagdoll = testProgressOpts.allowRagdoll,
        allowCuffed = testProgressOpts.allowCuffed,
        allowFalling = testProgressOpts.allowFalling,
        allowSwimming = testProgressOpts.allowSwimming,
    })
end

local function runProgressCircleMiddle()
    lib.progressCircle({
        duration = 6000,
        position = 'middle',
        canCancel = true,
        useWhileDead = testProgressOpts.useWhileDead,
        allowRagdoll = testProgressOpts.allowRagdoll,
        allowCuffed = testProgressOpts.allowCuffed,
        allowFalling = testProgressOpts.allowFalling,
        allowSwimming = testProgressOpts.allowSwimming,
    })
end

local function runProgressCircleBottom()
    lib.progressCircle({
        duration = 6000,
        position = 'bottom',
        canCancel = true,
        useWhileDead = testProgressOpts.useWhileDead,
        allowRagdoll = testProgressOpts.allowRagdoll,
        allowCuffed = testProgressOpts.allowCuffed,
        allowFalling = testProgressOpts.allowFalling,
        allowSwimming = testProgressOpts.allowSwimming,
    })
end

if progressOn then
    RegisterCommand('testoxlibpb', runProgressBar, false)
    RegisterCommand('testoxlibpc', runProgressCircleMiddle, false)
    RegisterCommand('testoxlibpcb', runProgressCircleBottom, false)
end

-- endregion Progress

-- region Skill check

local function runSkillCheck(label, difficulty)
    CreateThread(function()
        local ok = lib.skillCheck(difficulty, { 'w', 'a', 's', 'd' })
        print(('[ox_lib test] %s → %s'):format(label, ok and 'success' or 'fail'))
    end)
end

if minigameOn then
    RegisterCommand('testoxlibsc', function()
        runSkillCheck('skillCheck easy', 'easy')
    end, false)
    RegisterCommand('testoxlibsc_med', function()
        runSkillCheck('skillCheck medium', 'medium')
    end, false)
    RegisterCommand('testoxlibsc_hard', function()
        runSkillCheck('skillCheck hard', 'hard')
    end, false)
    RegisterCommand('testoxlibsc_chain', function()
        runSkillCheck('skillCheck chain', { 'easy', 'easy', 'hard' })
    end, false)
end

-- endregion Skill check

-- region Notify, TextUI, Clipboard

RegisterCommand('testoxlibnotify', function()
    lib.notify({
        title = 'ox_lib (success)',
        description = 'Dev notification — success type.',
        type = 'success',
        duration = 8000,
    })
    lib.notify({
        title = 'ox_lib (error)',
        description = 'Dev notification — error type.',
        type = 'error',
        duration = 8000,
        position = 'bottom',
    })
    lib.notify({
        title = 'ox_lib (info + icon)',
        description = 'Custom icon example.',
        type = 'info',
        icon = 'microchip',
        duration = 8000,
    })
end, false)

RegisterCommand('testoxlibtextui', function()
    lib.showTextUI('[E] - ox_lib TextUI dev test  \n[G] - Second line', {
        position = 'right-center',
        icon = 'door-open',
    })
    print('[ox_lib test] TextUI shown — testoxlibtextuihide to clear')
end, false)

RegisterCommand('testoxlibtextuihide', function()
    lib.hideTextUI()
end, false)

RegisterCommand('testoxlibclip', function()
    lib.setClipboard('ox_lib clipboard test — paste somewhere to verify.')
    lib.notify({ title = 'Clipboard', description = 'String sent to NUI clipboard helper.', type = 'success' })
end, false)

-- endregion Notify, TextUI, Clipboard

-- region Context

RegisterCommand('testoxlibctx', function()
    lib.registerContext({
        id = 'ox_lib_devtest_ctx_sub',
        title = 'ox_lib context — sub',
        options = {
            { title = 'Nested row', description = 'Dev test' },
            {
                title = 'Print args',
                icon = 'check',
                event = 'ox_lib:devtestContextEvent',
                args = { n = 42 },
            },
            { title = 'Back', menu = 'ox_lib_devtest_ctx', arrow = true },
        },
    })

    lib.registerContext({
        id = 'ox_lib_devtest_ctx',
        title = 'ox_lib context (dev test)',
        options = {
            {
                title = 'Select (callback)',
                description = 'Uses onSelect',
                icon = 'inbox',
                onSelect = function(args)
                    print('[ox_lib test] context onSelect', json.encode(args or {}))
                end,
                args = { hello = 'world' },
            },
            {
                title = 'Submenu',
                description = 'Nested menu',
                menu = 'ox_lib_devtest_ctx_sub',
                arrow = true,
                icon = 'bars',
            },
        },
    })

    lib.showContext('ox_lib_devtest_ctx')
end, false)

AddEventHandler('ox_lib:devtestContextEvent', function(args)
    print('[ox_lib test] context client event', json.encode(args or {}))
end)

-- endregion Context

-- region List menu

RegisterCommand('testoxlibmenu', function()
    lib.registerMenu({
        id = 'ox_lib_devtest_menu',
        title = 'ox_lib list menu (dev test)',
        position = 'top-right',
        options = {
            { label = 'Row one', description = 'First option' },
            { label = 'Scroll values', icon = 'tag', values = { 'A', 'B', { label = 'C', description = 'Third' } },
                description = 'Side scroll' },
            { label = 'Progress', progress = 65, icon = 'oil-can', description = 'Progress style row' },
            { label = 'Checkbox', checked = false },
        },
    }, function(selected, scrollIndex, args, checked)
        print(('[ox_lib test] menu confirm selected=%s scrollIndex=%s checked=%s args=%s'):format(
            selected, tostring(scrollIndex), tostring(checked), json.encode(args or {})))
    end)

    lib.showMenu('ox_lib_devtest_menu')
end, false)

-- endregion List menu

-- region Alert & input (await NUI — run in threads)

RegisterCommand('testoxlibalert', function()
    CreateThread(function()
        local result = lib.alertDialog({
            header = 'ox_lib alert (dev test)',
            content = 'General Kenobi  \n Markdown in **content** works when overflow is on.',
            centered = true,
            size = 'lg',
            overflow = true,
            cancel = true,
        })
        print('[ox_lib test] alert:', result)
    end)
end, false)

RegisterCommand('testoxlibinput', function()
    CreateThread(function()
        local rows = {
            { type = 'input', label = 'Text', placeholder = 'type…', description = 'Single-line input' },
            { type = 'number', label = 'Number', default = 5, min = 0, max = 10 },
            { type = 'checkbox', label = 'Checkbox' },
            {
                type = 'select',
                label = 'Select',
                options = {
                    { value = 'a', label = 'Alpha' },
                    { value = 'b', label = 'Bravo' },
                },
            },
            { type = 'slider', label = 'Slider', min = 0, max = 100, default = 50, step = 5 },
            { type = 'color', label = 'Color' },
            { type = 'time', label = 'Time', format = '24' },
        }

        local result = lib.inputDialog('ox_lib input (dev test)', rows, { allowCancel = true, size = 'md' })
        print('[ox_lib test] input:', json.encode(result or {}))
    end)
end, false)

-- endregion Alert & input

-- region Radial (items persist until removed; same id = replace)

RegisterCommand('testoxlibradial', function()
    lib.registerRadial({
        id = 'ox_lib_devtest_rad_sub',
        items = {
            { icon = 'palette', label = 'Sub A' },
            { icon = 'warehouse', label = 'Sub B' },
        },
    })

    lib.addRadialItem({
        id = 'ox_lib_devtest_rad_main',
        icon = 'wrench',
        label = 'ox_lib radial test',
        menu = 'ox_lib_devtest_rad_sub',
    })

    print('[ox_lib test] Radial: added dev items — open with your radial key (default Z). testoxlibradialclear removes them.')
end, false)

RegisterCommand('testoxlibradialclear', function()
    lib.removeRadialItem('ox_lib_devtest_rad_main')
    print('[ox_lib test] Radial: removed ox_lib dev main item (sub registration remains until resource stop).')
end, false)
