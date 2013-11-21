module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build : {
                src : 'src/*.js',
                dest : 'build/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
          files: ['Gruntfile.js', 'src/*.js'],
          options: {
            // options here to override JSHint defaults
            globals: {
              device: true,
              console: true,
              module: true,
              document: true
            }
          }   
        },  
		requirejs: {
          compile: {
            options: {
              baseUrl: "src",
              almond:false,
              removeCombined:true,
              wrap:true,
              name: "main", // a module name
              //dir: 'build', // an output directory
              // modules: [
                            // {
                                    // name: "main"
                            // }
              // ],
              out: 'build/app.min.js',
              // include: ['main'],
              optimize: 'uglify',
              normalizeDirDefines: 'all'
            }
          }
        }
    });


		grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		
		grunt.registerTask('default', ['requirejs','jshint']); 
		grunt.registerTask('production', 'lint requirejs less copy');


    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    //grunt.registerTask('default', ['uglify']);

};
