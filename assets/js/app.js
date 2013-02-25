Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});


window.C66Status = (function( $ ){

    var config = {
        dataSource: 'status.json',
        interval: 60000
    };

    var init = (function() {
        getData();
    })();

    function getData() {
        $.ajax({
            cache: false,
            url: config.dataSource
        }).done (function ( response ) {
            displayUpdateTime( response );
			displayTitle( response );
            displayStatus( response );
			displayStream( response );
			initPlugins();
            poll();
        }).fail (function ( jqXHR, textStatus, errorThrown ) {
            console.log('Ooops - there was a problem with the XHR');
            console.log( textStatus + ' ' + errorThrown );
            displayDataError();
            poll();
        });
    }

    function poll() {
        setTimeout(function(){
            getData();
        }, config.interval );
    }

    var displayDataError = function() {
        var msg = '<div class="error big-error">Ah heck &mdash; there was issue retrieving status data, please check Twitter for updates</div>';
        $('.is-loading').removeClass('is-loading').html( msg );
    };
	
	var initPlugins = function() {
		$('time').each(function(i, e) {
		  var time = moment( $(e).attr('datetime') );

		  $(e).html('<span class="moment">' + time.format('MMM Do, h:mm a') + '</span>');
		});
	};
	
    var displayUpdateTime = function( json ) {
		var tmplSource = $('#update-time-template').html(),
		 	tmpCompiled = Handlebars.compile( tmplSource );
		$('.js-updated').html( tmpCompiled( json ) );
    }
    
	var displayTitle = function( json ) {
		var tmplSource = $('#title-template').html(),
		 	tmpCompiled = Handlebars.compile( tmplSource );
	
		$('#js-lead').html( tmpCompiled( json ) );
	}
	
	var displayStatus = function( json ) {
		var tmplSource = $('#status-template').html(),
		 	tmpCompiled = Handlebars.compile( tmplSource );
	
		$('#js-primary-status').html( tmpCompiled( json ) );
	}
	
	var displayStream = function( json ) {
		var tmplSource = $('#stream-template').html(),
		 	tmpCompiled = Handlebars.compile( tmplSource );
	
		$('#js-status-stream').html( tmpCompiled( json ) );
        $('footer[role=contentinfo]').addClass('divider');
	}

})( jQuery );
