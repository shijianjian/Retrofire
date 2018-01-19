const { app, Menu, remote, ipcMain, dialog } = require('electron');

function createMenu() {
    let template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    accelerator:'CmdOrCtrl+O',
                    click: () => {
                        openFileDialog();
                    }
                },
                { type: 'separator' },
                {
                    label: "New Tab",
                    click: () => {
                        ipcMain.emit('add-new-tab');
                    },
                    accelerator: "CommandOrControl+T",
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {type: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'pasteandmatchstyle'},
                {role: 'delete'},
                {role: 'selectall'}
            ]
        },
        {
            label: 'View',
            submenu: [
                {role: 'reload'},
                {role: 'forcereload'},
                {role: 'toggledevtools'},
                {type: 'separator'},
                {type: 'separator'},
                {role: 'resetzoom'},
                {role: 'zoomin'},
                {role: 'zoomout'},
                {type: 'separator'},
                {role: 'togglefullscreen'}
            ]
        },
        {
            role: 'window',
            submenu: [
                {role: 'minimize'},
                {role: 'close'}
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: () => {
                        require('electron').shell.openExternal('https://www.google.com');
                    }
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
        template.unshift(
            {
                label: app.getName(),
                submenu: [
                    {role: 'about'},
                    {type: 'separator'},
                    {role: 'services', submenu: []},
                    {type: 'separator'},
                    {role: 'hide'},
                    {role: 'hideothers'},
                    {role: 'unhide'},
                    {type: 'separator'},
                    {role: 'quit'}
                ]
            }
        )

        // Window menu
        template[queryIndexOfLabelOrRoleInTemplate(template, null, "window")].submenu = [
            {role: 'close'},
            {role: 'minimize'},
            {role: 'zoom'},
            {type: 'separator'},
            {role: 'front'}
        ]
    };

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

let supported_file_extensions = [{
    name: 'PTS Files',
    extensions: ['pts']
}]

function openFileDialog() {
    let options = {
        title: 'Import a file',
        filters: supported_file_extensions
    };
    dialog.showOpenDialog(options, (cb)=> {
        ipcMain.emit('open-files', cb);
    });
}

function queryIndexOfLabelOrRoleInTemplate(template, label, role) {
    for(let tmp in template) {
        if (template[tmp].label === label
            || template[tmp].role === role
            ) {
            return Number(tmp);
        }
    }
}

module.exports = {
    buildMenu: createMenu
};