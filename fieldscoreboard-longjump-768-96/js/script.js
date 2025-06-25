setInterval( function() {
	jQuery( ".table-container" ).height( jQuery( window ).height() );
}, 1000);

var marqueeTimers = [];

document.addEventListener("displayResult", function(){

	// Do some animations
	jQuery( ".result" ).css( 'opacity', 1 );
	jQuery( ".result" ).animateCss( "bounceIn" );
});

document.addEventListener("displayAthlete", function(){

	jQuery( ".result" ).css( 'opacity', 0 );
});

setInterval( function() {

	var objs = jQuery( ".blue-mm:not(:visible):not(.typecursor)" );
	objs.each( function( index, obj ) {
		obj = jQuery( obj );
		if ( obj.data( 'wasHidden' ) )
			return;

		obj.css( "left", '0px' );
		obj.data( 'wasHidden', true );
	} );
	jQuery( ".blue-mm:visible" ).data( 'wasHidden', false );

	objs = jQuery( ".green-result-mm:not(:visible)" );
	objs.each( function( index, obj ) {
		obj = jQuery( obj );
		if ( obj.data( 'wasHidden' ) )
			return;
		console.log( obj.data( 'wasHidden' ) );
		obj.css( "width", '0px' );
		obj.data( 'wasHidden', true );
	} );
	jQuery( ".green-result-mm:visible" ).data( 'wasHidden', false );

}, 1000 );

function onUpdateData()
{
	var elements = jQuery('div.sideToSideMarqueeContainer');

	elements.each( function( index, el ) {
		el = jQuery( el );

		sideToSideMarqueeStop( el );

		/*console.log( el );
		console.log( el.get(0).scrollWidth );
		console.log( el.width() );*/
		if ( el.get(0).scrollWidth > el.width() )
		{
			/*console.log( 'create marquee' );
			console.log( el );*/
			// Your marquee code here
			sideToSideMarqueeStart( el );
		}
	});
}

function sideToSideMarqueeStop( container )
{
//	console.log( "sideToSideMarqueeStop()", container );
	marqueeTimers.forEach( function( timer ) {
		clearTimeout( timer );
	});
	marqueeTimers = [];

	var content = container.find( "div.sideToSideMarqueeContent" );

	content.stop();
	content.css( 'left', 0 );
	content.width( container.width() );
//	console.log( container.width() );

}

function sideToSideMarqueeStart( container )
{
//	console.log( "sideToSideMarqueeStart()", container );

	var content = container.find( "div.sideToSideMarqueeContent" );
	var left;

	if ( content.css( 'left' ) == '0px' )
	{
		left = -1 * ( container.get(0).scrollWidth - container.width() );
		content.width( Math.max( container.get(0).scrollWidth, content.parent().width() ) );
	}
	else
		left = 0;

//	console.log( "left = " + left + "" );

	content.animate(
		{
			left: left
		},
		1000,
		function() {
			marqueeTimers.push( setTimeout( function(){ sideToSideMarqueeStart( container ); }, 2000 ) );
		}
	);
}

$.fn.extend({
	animateCss: function ( animationName, onEnded ) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

		this.addClass('animated ' + animationName).one(animationEnd, function() {
//			console.log( "animationEnd" );
//			console.log( $(this) );
//			console.log( onEnded );
			$( this ).off( animationEnd );
			$( this ).removeClass('animated ' + animationName);
			if ( typeof onEnded == 'function' )
				onEnded();
		});

		if ( !$(this).is(":visible") )
		{
			$(this).removeClass('animated ' + animationName);
			$( this ).off( animationEnd );

			if ( typeof onEnded == 'function' )
				onEnded();
		}
	}
});


function animateShow( el, value, animation )
{
	if ( !value )
		return;

	el = jQuery( el );
	setTimeout( function() {
		el.show();
		el.animateCss( animation, onUpdateData );
	}, 1000);
}

function animateHide( el, value, animation )
{
	value = !value;
	if ( !value )
		return;

	el = jQuery( el );
	el.animateCss( animation, function(){ el.hide(); } );
}

// Add rivetsjs binders
rivets.binders.animateshow = function(el, value) {
	animateShow( el, value, "fadeInRight" );
};
rivets.binders.animateshowfade = function(el, value) {
	animateShow( el, value, "fadeIn" );
};

rivets.binders.animatehide = function(el, value) {
	animateHide( el, value, "fadeOutLeft" );
};
rivets.binders.animatehidefade = function(el, value) {
	animateHide( el, value, "fadeOut" );
};


rivets.binders.directshow = function(el, value) {
//	console.log( "directshow",value );
//	console.log( el );

	if ( !value )
		return;

	el = jQuery( el );
	el.show();
	setTimeout( onUpdateData, 100 );
};

rivets.binders.directhide = function(el, value) {
	value = !value;
//	console.log( "directhide",value );
//	console.log( el );

	if ( !value )
		return;

	el = jQuery( el );
	el.hide();
};

rivets.formatters.highjumpresult = function(value){
	if ( value == undefined )
		return "";

	value = value.replace(/(X)/g, '<span style="color: red;">$1</span>');
	value = value.replace(/(O)/g, '<span style="color: #04ef04;">$1</span>');

	return value;
};

function humanTime( unix_timestamp )
{
	var date = new Date(unix_timestamp*1000);
	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	return hours + ':' + minutes.substr(-2) + 'u';
}
rivets.formatters.humanTime = humanTime;