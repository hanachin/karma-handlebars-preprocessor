var handlebars = require('handlebars');

var createHandlebarsPreprocessor = function(logger, basePath) {
  var log = logger.create('preprocessor.handlebars');

  return function(content, file, done) {
    var processed = null;

    log.debug('Processing "%s".', file.originalPath);
    file.path = file.originalPath.replace(/\.hbs$/, '.js');

    var templateName = file.originalPath.replace(/\.hbs$/, '');

    try {
      processed = "(function() {var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};"
      + "templates['" + templateName + "'] = template("
      + handlebars.precompile(content)
      + ");})();";
    } catch (e) {
      log.error('%s\n  at %s', e.message, file.originalPath);
    }

    done(processed);
  };
};

createHandlebarsPreprocessor.$inject = ['logger', 'config.basePath'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:handlebars': ['factory', createHandlebarsPreprocessor]
};
