'use strict';
const fs = require('fs');
const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

const environmentInfo = {
  "stage": "",
}

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.task('update-appSettings', {
  execute: (config) => {
    return new Promise((resolve, reject) => {
      try {
      const stage = config.args['stage'] || environmentInfo.stage;
      console.info(`Using Stage ${stage}`);    
      let inputFile;
      let appSettingsFile;      
        inputFile = fs.readFileSync('./config/appSettings.all.json');
        let inputJson = JSON.parse(inputFile);
        console.info(inputJson.tenants[stage].FunctionUrl);
        console.info(inputJson.tenants[stage].FunctionAppID);
        
        appSettingsFile = fs.readFileSync('./src/appSettings.json');
        let appSettings = JSON.parse(appSettingsFile);
        appSettings.FunctionUrl = inputJson.tenants[stage].FunctionUrl;
        appSettings.FunctionAppID = inputJson.tenants[stage].FunctionAppID;
        
        fs.writeFileSync('./src/appSettings.json', JSON.stringify(appSettings));
        resolve();
      }
      catch(err) {
        console.log(err);
      }
    });
  }
});

build.addSuppression(/Warning/gi);


build.initialize(require('gulp'));
