module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        concat: {
            options: {
              separator: '',
              stripBanners: true,
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n',
            },
            dist: {
                src: ['src/intro.js','src/lib/*.js', 'src/device/*.js','src/mbaas/*.js','src/outro.js'],
                dest: 'build/runtime.js',
            },
        },
        uglify : {
            options : {
                // banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
           
            builda : {
                src : ['build/runtime.js'],
                dest : 'build/api-latest.js'
            },
            buildb : {
                src : ['src/qing.pdc.js','src/lightapp.js'],
                dest : 'build/lightapp.js'
            }
        },
        jshint: {
          files: ['Gruntfile.js','src/lightapp.js','src/lib/*.js', 'src/device/*.js','src/mbaas/*.js','build/runtime.js'],
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
        jsdoc : {
            dist : {
                src: ['src/device/*.js', 'src/mbaas/*.js'], 
                options: {
                    destination: 'doc'
                }
            }
        }
		// requirejs: {
          // compile: {
            // options: {
              // baseUrl: "src",
              // almond:false,
              // removeCombined:true,
              // //wrap:true,
              // wrap: {
                // startFile: "src/intro.js",
                // endFile: "src/outro.js"
              // },
              // name: "main", // a module name
              // //dir: 'build', // an output directory
              // // modules: [
                            // // {
                                    // // name: "main"
                            // // }
              // // ],
              // out: 'build/app.min.js',
              // // include: ['main'],
              // optimize: 'uglify',
              // normalizeDirDefines: 'all'
            // }
          // }
        // }
    });


		// grunt.loadNpmTasks('grunt-contrib-requirejs');
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-jsdoc');
		
		grunt.registerTask('default', ['concat','jshint','uglify']); 
		grunt.registerTask('doc', 'jsdoc');
		grunt.registerTask('production', 'lint requirejs less copy');
		grunt.registerTask('light', ['jshint','uglify']); 


    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    //grunt.registerTask('default', ['uglify']);

};
