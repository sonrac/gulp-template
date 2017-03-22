/**
 * Created by Donii Sergii <doniysa@gmail.com> on 5/1/17.
 */
module.exports = {
    build_dir: __dirname + '/build',
    dist_dir: __dirname + '/dist',
    server_root_path: __dirname + '/app',
    listen_port: 1111,
    copy_js_files: true,
    delete_files: true,
    build_template_path: '',
    js_path: 'js',
    css_path: 'css',
    dist_templates_path: 'templates',
    sass_path: 'sass',
    less_path: 'less',
    images_path: 'images',
    template: 'gulp-pug',
    template_options: {
        pretty: true
    },
    copyPaths: {
        'build': [
            './dist/plugins'
        ]
    },
    skip_styles_dir: [
        '!dist/'
    ],
    skip_templates_dir: [
        '!views/layout/*.pug',
        '!views/partial/*.pug',
    ],
    template_extensions: 'pug',
    livereload_options: {},
    rsync_js_callback: undefined
};