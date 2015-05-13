var fs = require('fs');
var platformWhitelist = ['wetransform'];
var jf = require('jsonfile');
var regexp = require('node-regexp');
var S = require('string');
var xlsxj = require("xlsx-to-json");
var parseXlsx = require('excel');


var excelFile = '00.scripts/ressources/authors.xlsx'

addAuthors(process.argv[2]);

function addAuthors(platform) {

	
	if (platformWhitelist.indexOf(platform) < 0) {
		console.log("The platform must be one of " + platformWhitelist.join(","));
		return;	
	};

	
	var thematiquesDir = platform + '/';

	if (!fs.existsSync(thematiquesDir)) {
    	console.log("Please enter a valid platform directory. For example: digital");
    	return;
	}

	var thematiquesList = fs.readdirSync(thematiquesDir)
							.filter(function(dirName) {
								return (dirName.indexOf('.json') < 0) 
										&& (dirName.match(/^\./) == null) 
										&& fs.lstatSync(thematiquesDir + '/' + dirName).isDirectory();
							});
	for(thematique in thematiquesList){
		var folder =thematiquesList[thematique];
		console.log(folder)
		parseExcel(folder);
	}
	
};

function parseExcel(folder){

	parseXlsx(excelFile, function(err, data) {
  		if(err) throw err;
		var jsonAuthor = data;
		var size = Object.keys(jsonAuthor).length;
		for(var key in jsonAuthor){
			var line = jsonAuthor[key];

			var slides = fs.readdirSync('/thematiques' + '/' + folder+ '/' )
						   .filter(function(slideName){
							   return (slideName.indexOf('.json') > 0);
						   });
			slides.forEach(function(slideName) {
				var slidePath = thematiquesDir + '/' + thematiqueDirName + '/' + slideName;
				updateSlide(slidePath,line);						
			});			
      	}
		console.log('\n DONE UPDATING LESSONS');
	});
}

function updateSlide(slidePath,line){
	var authors=[];
	var slide = JSON.parse(fs.readFileSync(slidePath));
	if(line[0]==slide.chapter){
		if(slide.authors){
			authors.push(line[1]);
			jf.writeFileSync(slidePath, slide);
		}	
		else{			
			slide.authors = [line[1]];
			jf.writeFileSync(slidePath, slide);
		}
	}

	

};

