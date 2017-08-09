var TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER;

var defaultSettings = {};
var chromeCapabilities = {
    desiredCapabilities: {
        browserName: "chrome"
    }
};

if (TRAVIS_JOB_NUMBER !== undefined) {
    defaultSettings = {
        launch_url: 'http://ondemand.saucelabs.com:80',
        selenium_port: 80,
        selenium_host: 'ondemand.saucelabs.com',
        silent: true,
        username: process.env.SAUCE_USERNAME,
        access_key: process.env.SAUCE_ACCESS_KEY,
        screenshots: {
            enabled: false,
            path: ''
        },
        globals: {
            waitForConditionTimeout: 10000
        },
        desiredCapabilities: {
            browserName: "chrome",
            build: 'build-${TRAVIS_JOB_NUMBER}',
            'tunnel-identifier': TRAVIS_JOB_NUMBER
        }
    };

    chromeCapabilities.platform = "OS X 10.11'";
    chromeCapabilities.version = "47";
} else {
    defaultSettings = {
        launch_url: 'http://localhost',
        selenium_port: 4444,
        selenium_host: 'localhost',
        silent: true,
        screenshots: {
            enabled: false,
            path: ''
        },
        desiredCapabilities: {
            browserName: "chrome",
            marionette: true
        }
    };
}

module.exports = {
    src_folders: ["test-e2e"],
    output_folder: "reports",
    test_settings: {
        default: defaultSettings,
        chrome: chromeCapabilities
    }
};