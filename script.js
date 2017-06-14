$(document).ready( function() {

	// declare global variables

	// this is my peronal key to access this website
	var apikey = '17073436';
	
	// page of results
	var page = 1;

	// prints variable values into the javascript console (console.log) as the script moves through the code
	var console_debug = true;

	var form_debug = false;

	// form submission event
	$('#search-form').submit( function(event) {

		if ( form_debug ) {

			var searchTitle = 'resident evil';
			var searchYear = '';

			$('input#search').val(searchTitle);
			$('input#year').val(searchYear);

			console.log("form debug mode - on");
			console.log("searchTitle = " + searchTitle);
			console.log("searchYear = " + searchYear);

		}

		var searchTitle = $('input#search').val();
		var searchYear = $('input#year').val();

		// set variables in an object literal
		var data = {
			apikey: '17073436',
			s: searchTitle,
			y: searchYear
		};

		// prevent default for submission action
		event.preventDefault();

		// hide the movie details section
		$('#movie-details-container').hide();

		// empty the movies list
		$('#movie-list-container #movie-list').empty();

		// display the search list panel
		$('#movie-list-container').show();

		// set base URL for movie database
		var url = 'http://www.omdbapi.com/';

		// set variables in an object literal
		var data = {
			apikey: '17073436',
			s: searchTitle,
			y: searchYear
		};

		// if in console debug mode then print variables to the console
		if ( console_debug ) {
			console.clear();
			console.log('apikey = ' + apikey);
			console.log('s = ' + searchTitle);
			console.log('y = ' + searchYear);
		}

		// set the AJAX callback function displayMovies
		var displayMovies = function (response) {

			var htmlStr = '';

			// if no movies keywords entered
			if ( searchTitle.length === 0 ) {

				if ( searchYear.length === 0 ) {

					htmlStr += '<li class="no-movies">';
						htmlStr += '<div><i class="material-icons icon-help">help_outline</i>You have not entered any movie title search terms. Please enter at least one movie title keyword.</div>';
					htmlStr += '</li>';

				} else if ( searchYear.length != 4 ) {

					htmlStr += '<li class="no-movies">';
						htmlStr += '<div><i class="material-icons icon-help">help_outline</i>You have entered an invalid year. Entering a year is not enough data. Please enter at least one movie title keyword.</div>';
					htmlStr += '</li>';

				} else if ( searchYear.length == 4 ) {

					htmlStr += '<li class="no-movies">';
						htmlStr += '<div><i class="material-icons icon-help">help_outline</i>You have entered a valid year but no movie title search keywords. Please enter at least one movie title keyword.</div>';
					htmlStr += '</li>';

				}

				// if in console debug mode then print variables to the console
				if ( console_debug ) {
					console.log('htmlStr = ' + htmlStr);
				}

			// if no movies found
			} else if ( !response.Search ) {

				htmlStr += '<li class="no-movies">';
					htmlStr += '<div><i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchTitle + '.</div>';
				htmlStr += '</li>';

				// if in console debug mode then print variables to the console
				if ( console_debug ) {
					console.log('htmlStr = ' + htmlStr);
				}

	        // else display movies found
			} else {

				console.log('response.Search.length = ' + response.Search.length + ' records found.');

				// loop through movies found object
				$.each(response.Search, function(index, item) {

					// create <li> element for each movie
					htmlStr += '<li>';
						htmlStr += '<a href="#" class="view-details" data-imdb="' + item.imdbID + '">';
							htmlStr += '<div class="poster-wrap" class="clearfix">';
								if ( item.Poster && item.Poster.length > 0 && item.Poster !== 'N/A' ) {
									htmlStr += '<img class="movie-poster" src="' + item.Poster + '">';
									$('#movie-details-container #poster-placeholder').hide();
								} else {
									htmlStr += '<i class="material-icons poster-placeholder"></i>';
									$('#movie-details-container #poster-placeholder').hide();
								}
							htmlStr += '</div>';
							htmlStr += '<div class="title-year-container">';
								htmlStr += '<div class="movie-title">' + item.Title + '</div>';
								htmlStr += '<div class="movie-year">' + item.Year + '</div>';
						htmlStr += '</div>';
						htmlStr += '</a>';
					htmlStr += '</li>';

				});

			}

			// put the movies found html string into the movies list element
			$('#movie-list').html(htmlStr);

		};

		// call AJAX method to get data
		$.getJSON(url, data, displayMovies);

	});

	// movie image click event
	$('body').on('click', '.view-details', function(event) {

		// prevent default action
		event.preventDefault();

		$('header').hide();

		// retrieve the imdb ID
		var selectedIMDB = $(this).data('imdb');

		// set base URL for movie database
		var url = 'http://www.omdbapi.com/';

		// set IMDB ID variable in an object literal
		var data = {
			apikey: '17073436',
			i: selectedIMDB
		};

		// set the AJAX callback function displayDetails
		var displayDetails = function (response) {

			// hide the search list
			$('#movie-list-container').hide();

			// assign retrieved movie data to local variables
			var movieTitle = response.Title;
			var movieYear = response.Year;
			var imgSrc = response.Poster;
			var movieDescription = response.Plot;
			var movieIMDB = response.imdbID;
			var movieRating = response.imdbRating;

			var text_length_small = 20;
			var text_length_medium = 30;
			var text_length_large = 35;

			// if a valid image exists
			if ( imgSrc && imgSrc.length > 0 && imgSrc !== 'N/A' ) {
				// hide the missing image placeholder icon
				$('#movie-details-container #poster-placeholder-details').hide();
				// set the source of the movie image
				$('#movie-image').attr('src', imgSrc);
				// display the movie image
				$('#movie-image').show();
			// else if no valid image
			} else {
				// hide the movie image element
				$('#movie-image').hide();
				// shot the missing image placeholder icon
				$('#movie-details-container #poster-placeholder-details').show();
			}

			var movie_title_string = movieTitle + " (" + movieYear + ")";
			var movie_title_string_length = movie_title_string.length;

			if ( console_debug ) {
				console.log('movie_title_string_length = ' + movie_title_string_length);
				console.log('text_length_large = ' + text_length_large);
				console.log('text_length_medium = ' + text_length_medium);
				console.log('text_length_small = ' + text_length_small);
			}

			$('#movie-title-year').attr('text-length', movie_title_string_length);
			$('#movie-imdb-rating').attr('text-length', movie_title_string_length);

			if ( movie_title_string_length >= text_length_large ) {
				$('#movie-details-back-button').addClass('text-length-long');
				$('#movie-title-year').addClass('text-length-long');
				$('#movie-imdb-rating').addClass('text-length-long');
			} else if ( movie_title_string_length >= text_length_medium ) {
				$('#movie-details-back-button').addClass('text-length-moderate');
				$('#movie-title-year').addClass('text-length-moderate');
				$('#movie-imdb-rating').addClass('text-length-moderate');
			} else if ( movie_title_string_length >= text_length_small ) {
				$('#movie-details-back-button').addClass('text-length-short');
				$('#movie-title-year').addClass('text-length-short');
				$('#movie-imdb-rating').addClass('text-length-shortf');
			} else if ( movie_title_string_length >= 0 ) {
				$('#movie-details-back-button').addClass('text-length-micro');
				$('#movie-title-year').addClass('text-length-micro');
				$('#movie-imdb-rating').addClass('text-length-micro');
			} else {
				// if no number above zero was found for the title, then redirect to the error page and include the ec (error_code)
				docment.location.href = 'error.php?ec=movie_title_string_length';
			}

			// set the name and year of the movie
			$('#movie-title-year').html(movieTitle + ' (' + movieYear + ')');

			// set the IMDB rating of the movie
			$('#movie-imdb-rating').html('IMDB Rating: <b>' + movieRating + '</b>');

			// set the description of the movie
			$('#movie-description').html(movieDescription);

			$('#movie-imdb-button').attr('href', 'http://www.imdb.com/title/' + movieIMDB + '/');
			
			// display the movie details section
			$('#movie-details-container').show();

		};

		// call JQuery method to get data and run the callback function
		$.getJSON(url, data, displayDetails);

	});

	// movie details back button click event
	$('#movie-details-back-button').click( function() {

		$('header').show();

		// hide the movie details section
		$('#movie-details-container').hide();

		// show the search list section
		$('#movie-list-container').show();

	});

});