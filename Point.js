function Point(x, y, name)
{
	this.name = name;
	this.x = x;
	this.y = y;
	this.edge = null;
}

Point.prototype.distance = function(x, y) {
   return(Math.sqrt( this.distance2(x,y) ));
};

Point.prototype.distance2 = function(x, y) {
   return(sqr(x-this.x) + sqr(y-this.y));
};

Point.prototype.setEdge = function(e) {
	this.edge = e;
};

Point.prototype.toHTML = function() {
	return `<b>p${this.name}</b><br/> (${this.x}, ${this.y})`;
};

Point.prototype.toJSON = function() {
    const string = `{"name":"p${this.name}", "x":${this.x}, "y":${this.y}}`;
    return JSON.parse(string);
};
Point.prototype.getName = function() {
	return `p${this.name}`;
};

function sqr(x) {
	return x*x;
}
