function doDelaunayGrouping(inTris, points){

	var groups = [];
	var counterX = 1;
	inTris.forEach(function(triangle){
		if (groups.length===0){
			var group_ = initGroup();
			groups.push(group_);
		}else {
			counterX++;
			var stop=false, act = false;
			groups.forEach(function(group_){
			 if(act===false){
				act = checkGroup(group_,triangle);		
			}})
			//when no group was found...make a new one
			if(act===false){
				var group_ = initGroup();
				groups.push(group_);}
		}
		function checkGroup(group__,triangle_){
			var bounds = group__.boundaries, test = false;
			//true, means lies inside boundaries if any point lies inside
			var points_ = group__.points;
			//go on if triangle lies inside of group boundaries
			var action = false;
			var inNoutSiders = [[],[]];
			var all_ids=[], new_points=[];
			//check id of points
			triangle_.forEach(function(point){
				var id = whoAmI(point);
				all_ids.push(id);
				//do I exist in the point list?
				var exists = false;
				points_.forEach(function(p){if(p["id"]===id)exists=true});
				//this point alread exists
				if (exists===true){action = true;inNoutSiders[0].push(id);}
				//store these points as not existing points
				else {inNoutSiders[1].push([id,point]);}
			});
			//add additional points...when they are 3 - no one belongs to the group
			if (inNoutSiders[1].length<3){
				inNoutSiders[1].forEach(function(point){
				points_.push({"id":point[0],"geom":point[1]});
				new_points.push(point[1]);})
			}
			//add current triangle only if anything has happened
			var tris=group__.triangles;
			if(action===true){
				//tris.push({"id":tris.length, "rel_points":all_ids});//, "geom":triangle_});
				tris.push({"id":tris.length, "rel_points":all_ids, "geom":triangle_});
				//change bounds if there was a new point in the triangle
				if (new_points.length!==0){
					var g_b=setBounds2(new_points,group__.boundaries);
					group__["boundaries"]=g_b;
				}
			}		
			//return action=false if no action has happened...means no point is related to the group
			return action;
		}
		function initGroup(){
			var group = {};
			//add the id of the 1st group...should be 0
			group["id"]=groups.length;
			//define and add the initial points of this first group
			var initial_ids = [];
			var points_ar = triangle.map(function(point){
				var point_obj = {"id":whoAmI(point),"geom":point};
				initial_ids.push(whoAmI(point));
				return point_obj;
			});
			group["points"]=points_ar;
			//define and add the initial triangle
			//var triangle_obj = {"id":0, "rel_points":initial_ids};//, "geom":triangle};
			var triangle_obj = {"id":0, "rel_points":initial_ids, "geom":triangle};
			group["triangles"]=[triangle_obj];
			//define the bounds of the group
			var group_bounds=setBounds(group["points"],[3000,3990,0,0]);
			group["boundaries"]=group_bounds;
			return group;			
		}
		function setBounds2(points, bounds){
			points.forEach(function(point){
				if (point[0]<bounds[0])bounds[0]=point[0];
				if (point[0]>bounds[2])bounds[2]=point[0];
				if (point[1]>bounds[3])bounds[3]=point[1];
				if (point[1]<bounds[1])bounds[1]=point[1];
			});
			return bounds;
		}
		function setBounds(points, bounds){
			points.forEach(function(point){
				if (point.geom[0]<bounds[0])bounds[0]=point.geom[0];
				if (point.geom[0]>bounds[2])bounds[2]=point.geom[0];
				if (point.geom[1]>bounds[3])bounds[3]=point.geom[1];
				if (point.geom[1]<bounds[1])bounds[1]=point.geom[1];
			});
			return bounds;
		}
		function whoAmI(relPoint){
			var id = -1; 
			points.forEach(function(point,i){if(point===relPoint)id=i;})
			return id;
		}
	});

	return groups;
}
var groups_layer;
function displayPoints(layer, inTris, points){
	groups_layer = layer;
	var groups = doDelaunayGrouping(inTris, points);
	groups.forEach(function(group,i){
		group.points.map(function(point){group_points.push([point.geom,i]);});
	})
	setGroupForm(groups.length,"points");

	return groups;

}

function setGroupForm(length, type){
	var 	groupF = d3.select("#groupSel");
	groupF.selectAll("form").remove();
	var gForm = groupF.append("form")
		.attr("name","toleranceForm");
	var groupSelect;
	if (type==="points")groupSelect = gForm.append("select").attr("name","groupDD").attr("onChange","visGroupPoints(value)").attr("size","3");
	else if (type==="polygons")groupSelect = gForm.append("select").attr("name","groupDD").attr("onChange","visGroupGeoms(value)").attr("size","3");
	var group_num = new Array();
	for (var i=0;i<length;i++){group_num.push(i);}
	groupSelect.selectAll("option").remove();
	groupSelect.selectAll("option").data(group_num).enter()
			.append("option").attr("value",function(d){return d;}).text(function(d){return d;});
}

function visGroupPoints(val){
	setPointVis(group_points,val);
}
function visGroupGeoms(val){
	//setPointVis(group_points,val);
	//delaunay.selectAll("path").remove();
	var paths = urban.selectAll("path"), vertices=[];
	paths.attr("fill",function(d){
		var test = false;
		//just if groups_vals is not empty...roups_vals contains the id-values of all points within all groups
		if (groups_vals.length>0){
			//get the required group and loop through its ids
			groups_vals[val].forEach(function(e){
				//looking for an id that equates with the id of current geometry (d.id) 
				if (e===d.id) {test = true;	
					//when found...check if its a Multi- or a single Polygon, get all points and store them projected
					if (d.coordinates.length===1){d.coordinates[0].map(function(coord){vertices.push(projection(coord))} )}
					else {d.coordinates.map(function(coords){ coords.map(function(coord){vertices.push( projection(coord))})})}
				}
			});}
		if (test===true)return "#ff0000";
	})
	var triangles = groups[val].triangles.map(function(d){return d3.geom.polygon(d.geom)});
	var hull = defineHull(vertices, triangles); 
	console.log(triangles[0].clip(hull))
}

function defineHull(vertices, triangles){
	hull_layer.selectAll("path").remove();
	var hull=hull_layer.append("path");
	var hull_geom = d3.geom.hull(vertices);
	var hull_poly = d3.geom.polygon(hull_geom);
	
	hull.datum(hull_poly).attr("d", function(d) { return "M" + d.join("L") + "Z"; });
	return hull_poly;
}
function setPointVis(points_,i){
	groups_layer.selectAll("circle").remove();
	groups_layer.selectAll("circle")
	    .data(points_)
	  .enter().append("circle")
	    .attr("cx",function(d) { return d[0][0]})
	    .attr("cy",function(d) { return d[0][1]})
	    .attr("r",function(d) { if(d[1]===parseInt(i))return 5
			else return 2})
	    .attr("fill",function(d) { if(d[1]===parseInt(i))return "#ff00ff"
			else return "#0000ff"});

}
