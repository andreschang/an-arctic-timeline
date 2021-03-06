function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        return true;
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return true;
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       return true;
    }
    // other browser
    return false;
}

console.log(detectIE())

if ( detectIE() == true ) {
  $('#noIE').css('opacity', '1');
} else {

$(window).on('load', function() { // makes sure the whole site is loaded
  // $('#status').delay(500).fadeOut(); // will first fade out the loading animation
  // $('#preloader').delay(1000).fadeOut('slow'); // will fade out the white DIV that covers the website.

/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */



var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 560;
  // var width = 600;
  var height = 520;
  var mobile = $(window).width();
  var newHeight = $(window).height();
  var docWindow = 480;
  var top_height = 710;
  var margin = { top: 0, left: 10, bottom: 40, right: 10 };

  var lastIndex = -1;
  var activeIndex = 0;

  var svg = null;
  var g = null;

  var activateFunctions = [];
  var updateFunctions = [];

  var panelGroup = function (selection) {
    selection.each(function (timelineData) {
      svg = d3.select(this).selectAll('svg').data([timelineData]);
      var svgE = svg.enter().append('svg');
      svg = svg.merge(svgE);

      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', top_height + margin.top + margin.bottom);

      svg.append('g');

      g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      setupVis(timelineData)
      setupSections();

      var mobile = $(window).width();
      console.log(mobile);
    });
  };

  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   */

  var setupVis = function (timelineData) {
    if(mobile > docWindow){
    g.append('g').selectAll('img')
      .data(timelineData.filter(function(d) {return d.imgFile != ''}))
      .enter()
      .append('svg:a')
        .attr('xlink:href', function(d) {
          var file = d.lightBoxFile != '' ? d.lightBoxFile : d.imgFile;
          return 'images/'+file+'.jpg'})
        .attr('data-lightbox', function(d) {return 'image #'+d.slide})
        .attr('data-title', function(d) {return d.imgName+'<br>'+d.imgSource})
      .append('svg:image')
      .attr('class', function(d, i) {return 'slide'+d.slide+' img'})
      .attr('xlink:href', function(d,i) {return 'images/'+d.imgFile+'.jpg'})
      .attr('x', function(d,i) {return d.imgX})
      .attr('y', function(d,i) {return (d.imgY)})
      .attr('width', function(d, i) {return (width-d.imgX)})
      .attr('height', function(d, i) { return ((width-(d.imgX))*d.fileHeight/d.fileWidth)})
      .on("mouseover", imageMouseOver)
      .on("mouseout", imageMouseOut)
      .style('opacity', 0);
      } else {

     g.append('g').selectAll('img')
      .data(timelineData.filter(function(d) {return d.imgFile != ''}))
      .enter()
      .append('svg:image')
      .attr('class', function(d, i) {return 'slide'+d.slide+' img'});
      }

    if(mobile > docWindow) {
    g.append('g').selectAll('eventDepth')
      .data(timelineData)
      .enter()
      .append('text')
      .attr('class', function(d, i) {return 'slide'+i+' eventDepth'})
      .attr('y', (height / 31)+100)
      .attr('x', 6)
      .text(function(d) {
        var depth = d.depthm <= 0.0 ? d.depthm+' meters / '+d.depthmi+' miles' : '';
        return depth})
      .style('opacity', 0);

    g.append('g').selectAll('eventYear')
      .data(timelineData)
      .enter()
      .append('text')
      .attr('class', function(d, i) {return 'slide'+i+' eventYear'})
      .attr('y', (height / 10.8)+100)
      .attr('x', 6)
      .text(function(d) { var showYear = d.start >= 0 ? d.start : -d.start+' BCE';
        return( showYear );})
      .style('opacity', 0);

     g.append('g').selectAll('title')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        // .attr('y', (height / 2.42)+100)
        .attr('y', (height / 5)+60)
        .attr('x', 0)
        .attr("width", 450)
        .attr("height", 300)
        .attr('class', function(d, i) {return 'slide'+i+' title'})
        .style('opacity', 0)
      .append('xhtml:div')
        .html(function(d) {return d.title});

      } else {

      g.append('g').selectAll('title')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        // .attr('y', (height / 2.42)+100)
        .attr('y', (height / 5)+175)
        .attr('x', 0)
        .attr("width", 400)
        .attr("height", 300)
        .attr('class', function(d, i) {return 'slide'+i+' title'})
        .style('opacity', 0)
      .append('xhtml:div')
        .html(function(d) {return d.title});


          g.append('g').selectAll('eventDepth')
      .data(timelineData)
      .enter()
      .append('text')
      .attr('class', function(d, i) {return 'slide'+i+' eventDepth'})
      .attr('y', (height / 31)+ 170)
      .attr('x', 0)
      .text(function(d) {
        var depth = d.depthm <= 0.0 ? d.depthm+' meters / '+d.depthmi+' miles' : '';
        return depth})
      .style('opacity', 0);

    g.append('g').selectAll('eventYear')
      .data(timelineData)
      .enter()
      .append('text')
      .attr('class', function(d, i) {return 'slide'+i+' eventYear'})
      .attr('y', (height / 10.8)+190)
      .attr('x', 0)
      .text(function(d) { var showYear = d.start >= 0 ? d.start : -d.start+' BCE';
        return( showYear );})
      .style('opacity', 0);
      }

    g.append('g').selectAll('fRead')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        .attr('y', (height / 2.42)+100)
        .attr("width", 500)
        .attr("height", 500)
        .attr('class', function(d, i) {return 'slide'+i+' fRead fR'})
        .style('opacity', 0)
      .append('xhtml:div')
        .html(function(d) {return "<h1>Resources</h1>"+d.furtherReading});

    if(mobile > docWindow) {
      g.append('g').selectAll('desc')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        .attr('y', (height / 2.42)+100)
        .attr("width", 510)
        .attr("height", 306)
        .attr('class', function(d, i) {return 'slide'+i+' desc'})
        .style('opacity', 0)
      .append('xhtml:div')
        .html(function(d) {return d.desc});

        g.append('g').selectAll('quote')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        // .attr('y', (height / 2.42)+100)
        .attr('y', (height / 2.42)+100)
        .attr("width", 510)
        .attr("height", 330)
        .attr('class', function(d, i) {return 'slide'+i+' quote'})
        .style('opacity', 0)
      .append('xhtml:div')
        .html(function(d) {return '<p>'+d.quote+'</p>'});
        // .html(function(d) {return d.quote});

    } else {

      g.append('g').selectAll('desc')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        .attr('class', function(d, i) {return 'slide'+i+' desc'})
        .style('opacity', 0);


      g.append('g').selectAll('quote')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        .attr('y', (height / 2.42)+250)
        // .attr("width", 510)
        // .attr("height", 500)
        .attr("width", 425)
        .attr("height", 750)
        .attr('class', function(d, i) {return 'slide'+i+' quote'})
        .style('opacity', 0)
      .append('xhtml:div')
        // .html(function(d) {return d.quote});
        .html(function(d) {return '<p>'+d.mobileQuote+'</p>'});
    }


    g.append('g').selectAll('arrows')
      .data(timelineData)
      .enter()
      .append('text')
      .text('READ MORE')
      .attr('class', function(d, i) {return 'slide'+i+' arrow'})
      .attr('x', function(d,i) {var qEnd = d3.select('#qEnd'+d.slide);
        var arrowX0 = qEnd.node().getBoundingClientRect().right-340;
        var arrowX = arrowX0 <= 370 ? arrowX0 : 1;
        // console.log("arrowx "+arrowX);
        return arrowX})
      .attr('y', function(d,i) {var qEnd = d3.select('#qEnd'+d.slide);
        var arrowX0 = qEnd.node().getBoundingClientRect().right-340;
        var arrowY0 = qEnd.node().getBoundingClientRect().bottom-8;
        var arrowY = arrowX0 <= 370 ? arrowY0 : arrowY0+36;
        // console.log("arrowy "+arrowY);
        return arrowY})
      .on("click", function(d, i){
        var sClass = '.slide'+d.slide;
        g.selectAll(sClass).filter('.quote, .arrow')
          .transition()
          .duration(0)
          .attr('pointer-events', 'none')
          .style('opacity', 0);
        g.selectAll(sClass).filter('.desc, .fReadArrow')
          .transition()
          .duration(200)
          .attr('pointer-events', 'all')
          .style('opacity', 1);
        g.selectAll(sClass).filter('.fReadArrow')
          .attr('cursor', 'pointer');})
      .on("mouseover", linkMouseOver)
      .on("mouseout", linkMouseOut)
      .attr('width', 140)
      .attr('height', 140)
      .style('opacity', 0);

    g.append('g').selectAll('fReadArrows')
      .data(timelineData.filter(function(d) {return d.furtherReading != '' }))
      .enter()
      .append('text')
      .text('RESOURCES')
      .attr('class', function(d) {return 'slide'+d.slide+' fReadArrow fR'})
      .attr('x', 1)
      .attr('y', 638)
      .on("click", function(d){
        var sClass = '.slide'+d.slide;
        g.selectAll(sClass).filter('.desc,.fReadArrow')
          .transition()
          .duration(0)
          .attr('pointer-events', 'none')
          .style('opacity', 0);
        g.selectAll(sClass).filter('.fRead')
          .transition()
          .duration(200)
          .attr('pointer-events', 'all')
          .style('opacity', 1);})
      .on("mouseover", linkMouseOver)
      .on("mouseout", linkMouseOut)
      .attr('width', 140)
      .attr('height', 140)
      .style('opacity', 0);


    // Custom slide edits
    g.selectAll('.slide0').filter('.eventYear,.arrow').remove();
    g.selectAll('.slide2').filter('.eventYear').text('2000s');
    g.selectAll('.slide4').filter('.desc').attr('height', 328);
    g.selectAll('.slide6').filter('.eventYear').text('Late 1800s');
    g.selectAll('.slide8').filter('.eventYear').text('Early 1800s');
    g.selectAll('.slide9').filter('.eventYear').text('1500-1800');
    g.selectAll('.slide10').filter('.eventYear').text('1300-1850');
    g.selectAll('.slide0').filter('.arrow').remove()
    g.selectAll('.slide13').filter('.eventYear').text('3,000 BCE');
    g.selectAll('.slide13').filter('.fReadArrow').remove();
    g.selectAll('.slide14').filter('.eventYear').text('5,000 BCE');
    // g.selectAll('.slide14').filter('.fReadArrow').attr('y', 538);
    g.selectAll('.slide15').filter('.eventYear').text('11,000-9,500 BCE');
    g.selectAll('.slide16').filter('.eventYear').text('22,000 BCE');
    g.selectAll('.slide17').filter('.eventYear').text('130,000-115,000 BCE');
    g.selectAll('.slide18').filter('.eventYear').text('237,000 BCE');
    g.selectAll('.slide19').filter('.eventYear').text('1,000,000+ BCE');

    if (mobile > docWindow) {
      g.selectAll('.slide9,.slide15,.slide14').filter('.fReadArrow').attr('y', 642);
      g.selectAll('.slide0').filter('.quote').attr('transform', 'translate(0,-45)');
      g.selectAll('.slide9').filter('.desc').attr('transform', 'translate(0,-25)')
        .attr('height', 330);
      g.selectAll('.slide12').filter('.desc').attr('transform', 'translate(0,-25)')
      .attr('height', 330);
      g.selectAll('.slide13').filter('.desc').attr('transform', 'translate(0,-25)')
      .attr('height', 350);
      g.selectAll('.slide15').filter('.desc').attr('transform', 'translate(0,-50)')
      .attr('height', 355);
      g.selectAll('.slide19').filter('.desc,.quote,.arrow').attr('transform', 'translate(0,10)');
      g.selectAll('.slide3,.slide14').filter('.fReadArrow').attr('transform', 'translate(0,-80)');
      g.selectAll('.slide14').filter('.desc').attr('height', 226);

      g.selectAll('.slide12').filter('.arrow').attr('y', 466)
      .attr('x', 1);
    } else {
      g.selectAll('.slide0').filter('.quote').attr('transform', 'translate(0,-25)');
    }

    };

  var setupSections = function() {

    for (var i = 0; i < 21; ++i){

      activateFunctions[i] = getFun(i);
      updateFunctions[i] = getUp(i)};

    function getFun(val) {
        var xb = val-1,
          xf = val+1;

        return function() {
        g.selectAll('.slide'+xb)
          .transition()
          .duration(0)
          .style('opacity', 0);

        g.selectAll('.slide'+xf)
          .transition()
          .duration(0)
          .style('opacity', 0);

        g.selectAll(':not(.slide'+val+')')
          .attr('pointer-events', 'none');

        g.selectAll('.slide'+val).filter(':not(.desc)').filter(':not(.fR)')
          .transition()
          .duration(600)
          .style('opacity', 1.0);

        g.selectAll('.slide'+val).filter('.img')
          .attr('pointer-events', 'all')
          .attr('cursor', 'pointer')
          .transition()
          .duration(600)
          .style('opacity', 0.4);

        g.selectAll('.slide'+val).filter('.arrow')
          .attr('pointer-events', 'all')
          .attr('cursor', 'pointer')
          .transition()
          .duration(600)
          .style('opacity', 0.7);

        if (val == 0) {
          g.selectAll('.slide0').filter('.quote').attr('pointer-events', 'all');
        }

        // g.selectAll('.slide'+val).filter('.arrow')
        //   .transition()
        //   .duration(600)
        //   .style('opacity', 0.7);
      }

      };

    function getUp(val) {
      return function(progress) {
          var xb = val-1,
          xf = val+1,
          img_y = [120, 100, 120, 126, 50, 120, 120];

        g.selectAll('.slide'+xb).filter('.img')
        // trinomial scroll for image to reach its center and then fly off screen
          .attr('transform', function(d,i) {
            var img_h = d3.select(this).node().getBBox().height,
            offset = (height-img_y[i]-img_h/2)/(height);
            // console.log((-4*Math.pow((progress-offset),3)));
            return 'translate(0,'+(-4*Math.pow((progress-offset),3))*(height+img_h)+')'}
          )}
    }};


  panelGroup.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  panelGroup.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return panelGroup;
};


/**
 * sets up the scroller and
 * displays the visualization.
 * @param data - loaded tsv data
 */
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select('#vis')
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.4; });

    // activate current section
    plot.activate(index);
  });


  // for (i = 0; i < 16; i++) {
  //   console.log($('.arrow')[i].getBoundingClientRect())
  // }

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}

// load data and display
d3.tsv('timeline.5.2.tsv', display);

});
}
