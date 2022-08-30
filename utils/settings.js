module.exports = {
    construct: (options) => {

        let userSettings = {
            dryMode: true,
            reportMode: false,
            relativeMode: true,
            pathToProject: './'
        };

        (options.dry) ? userSettings.dryMode = true : userSettings.dryMode = false;
        (options.report) ? userSettings.reportMode = true : userSettings.reportMode = false;
        (options.relative) ? userSettings.relativeMode = true : userSettings.relativeMode = false;
        (options.path) ? userSettings.pathToProject = options.path : userSettings.pathToProject = './';

        return userSettings;

    }
}