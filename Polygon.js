function Polygon(name) {
    this.name = name;
    this.edge = null;
    this.centroid = null;
}

Polygon.prototype.makeCentroid = function () {
    var e = this.edge.next;
    var i = 0, xSum = 0, ySum = 0;

    while (e.name !== this.edge.name){
        i++;
        xSum += e.origin.x;
        ySum += e.origin.y;
        e = e.next;
    }
    this.centroid = new Point(xSum/i, ySum/i, `${this.name}center`);
}

Polygon.prototype.setEdge = function(e) {
    this.edge = e;
    this.makeCentroid();
}

Polygon.prototype.getCenter = function() {
    return this.centroid;
}

Polygon.prototype.getName = function() {
    return `polygon${this.name}`;
}