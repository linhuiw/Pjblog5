var layout = new Class(function(querys, forms){
    this.createServer(querys, forms);
    this.category();
});

layout.extend(require(':public/library/layout'));

module.exports = layout;