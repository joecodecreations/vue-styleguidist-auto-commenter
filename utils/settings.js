module.exports = {
    construct: (options) => {

        let userSettings = {
            dryMode: true,
            reportMode: false,
            absoluteMode: false,
            pathToProject: '/'
        };

        (options.dry) ? userSettings.dryMode = true : userSettings.dryMode = false;
        (options.report) ? userSettings.reportMode = true : userSettings.reportMode = false;
        (options.absolute) ? userSettings.absoluteMode = true : userSettings.absoluteMode = false;
        (options.path) ? userSettings.pathToProject = options.path : userSettings.pathToProject = '/';

        return userSettings;

    }
}