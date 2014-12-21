jQuery(document).ready(function(){
jQuery('.article h1 a').click(function(){
    jQuery(this).text('页面载入中……');
    window.location = jQuery(this).attr('href');
    });
});

// 滚屏
jQuery(document).ready(function(){
jQuery('#roll_top').click(function(){jQuery('html,body').animate({scrollTop: '0px'}, 800);}); 
jQuery('#ct').click(function(){jQuery('html,body').animate({scrollTop:jQuery('#comment').offset().top}, 800);});
jQuery('#fall').click(function(){jQuery('html,body').animate({scrollTop:jQuery('#footer').offset().top}, 800);});
});

//顶部导航下拉菜单
jQuery(document).ready(function(){
jQuery("#nav li").each(function(){
if($(this).find("ul").length!=0){$(this).find("a:first").addClass("hasmenu")}
})
jQuery(".topnav ul li").hover(function(){
jQuery(this).children("ul").show();
},function(){
jQuery(this).children("ul").hide();
});
});

//侧边栏TAB效果
jQuery(document).ready(function(){
jQuery('#tabnav li').click(function(){
	jQuery(this).addClass("selected").siblings().removeClass();
	jQuery("#tab-content > ul").eq(jQuery('#tabnav li').index(this)).fadeIn(800).siblings().hide();
});
});

//图片渐隐
jQuery(function () {
jQuery('.thumbnail img').hover(
function() {jQuery(this).fadeTo("fast", 0.5);},
function() {jQuery(this).fadeTo("fast", 1);
});
});