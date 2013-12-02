module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        concat: {
            options: {
              separator: '',
              stripBanners: true,
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            dist: {
                src: ['src/intro.js', 'src/device/*.js','src/mbaas/*.js', 'src/outro.js'],
                dest: 'dist/clouda-runtime.js',
            },
        },
        uglify : {
            options : {
                // banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
           
            build : {
                src : ['dist/clouda-runtime.js'],
                dest : 'build/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
          files: ['Gruntfile.js', 'src/device/*.js','src/mbaas/*.js','dist/clouda-runtime.js'],
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
		
		grunt.registerTask('default', ['concat','uglify','jshint']); 
		grunt.registerTask('doc', 'jsdoc');
		grunt.registerTask('production', 'lint requirejs less copy');


    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    //grunt.registerTask('default', ['uglify']);

};
