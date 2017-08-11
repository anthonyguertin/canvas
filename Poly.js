function Poly() {
    this.points = [];
    this.edges = [];
    this.polygons = [];

    this.width = 0;
    this.height = 0;
    this.edgeCount = 0;
}

Poly.prototype.makeFromPointArray = function(points) {
    this.wipe();
    if (this.isCW(points)) points = points.reverse();
    var lastEdge;
    lastEdge = null;
    var i;
    
    for (i = 0; i < points.length; i++) {
        if (i === 0) {
            this.firstPoint(points[i].x, points[i].y);
        } else if (i === 1) {
            lastEdge = this.points[i - 1].edge;
            this.secondPoint(points[i].x, points[i].y, lastEdge);
        } else {
            lastEdge = this.points[i - 1].edge.twin;
            this.thirdPoint(points[i].x, points[i].y, lastEdge);
        }
    }
    lastEdge = this.points[i - 1].edge.twin;
    const firstEdge = this.points[0].edge;
    this.close(firstEdge, lastEdge);
};

/*Poly.prototype.Compute = function(p, w, h, done=false){
	this.points = p;
	if(this.points.length < 2) return [];

	this.width = w;
	this.height = h;

	this.edges = [];
	for(i=0; i<this.points.length; i++){
		edge = new HalfEdge(this.points[i], edges.length-1);
		this.edges.push(edge);		
		this.points[i].setEdge(this.edges[i]);

		if(i!=0){
			this.edges[i-1].setNextEdge(this.edges[i]);
			this.edges[i].setPrevEdge(this.edges[i-1]);
		}
		if(done){
			this.edges[i].setNextEdge(this.edges[0]);
			this.edges[0].setPrevEdge(this.edges[i]);
		}
	}
}*/
/** Add a point to the polygon
 * 
 * X-Coordinate of the point @param {} x 
 * Y-Coordinate of the point @param {} y 
 *
 * @return { void }
 */
Poly.prototype.addPoint = function(x, y) {
    const i = this.points.length;
    const p = new Point(x, y, i);

    this.points.push(p);

//console.log(this.points, i);
    //add the edge
    const edge = new HalfEdge(p, this.edges.length);
    this.edges.push(edge);
    this.points[i].setEdge(edge);

    //fix the relationships
    if (i !== 0) {
        this.edges[i - 1].setNextEdge(this.edges[i]);
        this.edges[i].setPrevEdge(this.edges[i - 1]);
    }
};
Poly.prototype.firstPoint = function(x, y) {
    const p = new Point(x, y, 0);
    this.points.push(p);

    const edge = new HalfEdge(p, '0');
    const reverse = new HalfEdge(null, '0*');
    this.edges.push(edge);
    this.edges.push(reverse);
    p.setEdge(edge);

    edge.setTwin(reverse);
    reverse.setTwin(edge);
    edge.setNextEdge(reverse);
    reverse.setPrevEdge(edge);

    edge.setPrevEdge(reverse);
    reverse.setNextEdge(edge);
}

Poly.prototype.secondPoint = function(x, y, old) {
    const i = this.points.length;
    const p = new Point(x, y, i);

    this.points.push(p);
    p.setEdge(old.twin);

    old.twin.setOrigin(p);
}

Poly.prototype.thirdPoint = function(x, y, old) {
    var i = this.points.length;
    var p = new Point(x, y, i);
    this.points.push(p);

    var edge = new HalfEdge(old.twin.origin, i - 1); //or old.next.origin
    var reverse = new HalfEdge(p, (i - 1) + "*");
    this.edges.push(edge);
    this.edges.push(reverse);
    p.setEdge(reverse);
    old.twin.origin.setEdge(edge);

    edge.setTwin(reverse);
    reverse.setTwin(edge);

    edge.setNextEdge(reverse);
    reverse.setPrevEdge(edge);

    //order is important here
    reverse.setNextEdge(old.next);
    old.next.setPrevEdge(reverse);
    edge.setPrevEdge(old);
    old.setNextEdge(edge); //this is the definition of who "old" is
};
Poly.prototype.close = function(first, last) { //only to the origin
    var i = this.points.length;

    var edge = new HalfEdge(last.twin.origin, i - 1);
    var reverse = new HalfEdge(this.points[0], (i - 1) + "*");
    this.edges.push(edge);
    this.edges.push(reverse);
    edge.setTwin(reverse);
    reverse.setTwin(edge);
    last.twin.origin.setEdge(edge);

    first.setPrevEdge(edge);
    edge.setNextEdge(first);
    edge.setPrevEdge(last);
    last.setNextEdge(edge);

    first.twin.setNextEdge(reverse);
    reverse.setPrevEdge(first.twin);
    reverse.setNextEdge(last.twin);
    last.twin.setPrevEdge(reverse);

    var closed = new Polygon(this.polygons.length);
    this.polygons.push(closed);
    if (this.isEdgeCW(edge)) {
        closed.setEdge(reverse);
        this.pointEdgeLoop(reverse, closed);
    } else {
        closed.setEdge(edge);
        this.pointEdgeLoop(edge, closed);
    }
};

Poly.prototype.Edges = {
     get: this.e = this.edges,
     set [this.e](v) = v
};
Poly.prototype.getPoints = function() {
    return this.points;
};
Poly.prototype.getPolygons = function() {
    return this.polygons;
};

Poly.prototype.addDiagonal = function(a, b) {
    var edgeA = a.edge;
    var edgeB = b.edge;
    var tempA = edgeA.twin.next;
    var tempB = edgeB.twin.next;

    //console.log(edgeA, edgeB);
    var aNew = new HalfEdge(a, this.edges.length);
    var bNew = new HalfEdge(b, this.edges.length + "*");
    this.edges.push(aNew);
    this.edges.push(bNew);

    tempB.twin.setNextEdge(bNew);
    bNew.setNextEdge(edgeA);
    edgeA.setPrevEdge(bNew);
    bNew.setPrevEdge(tempB.twin);

    tempA.twin.setNextEdge(aNew);
    aNew.setNextEdge(edgeB);
    edgeB.setPrevEdge(aNew);
    aNew.setPrevEdge(tempA.twin);


    var closed = new Polygon(this.polygons.length);
    this.polygons.push(closed);
    if (this.isEdgeCW(aNew)) {
        closed.setEdge(bNew);
        this.pointEdgeLoop(bNew, closed);
        aNew.setPolygon(aNew.next.polygon);
        aNew.polygon.setEdge(aNew);
    } else {
        closed.setEdge(aNew);
        this.pointEdgeLoop(aNew, closed);
        bNew.setPolygon(bNew.next.polygon);
        bNew.polygon.setEdge(bNew);
    }
    //console.log(this.polygons);
    //tempA.polygon.setEdge(bNew);
    //tempB.polygon.setEdge(aNew);
};
Poly.prototype.wipe = function() {
    this.points = [];
    this.edges = [];
    this.polygons = [];
};
Poly.prototype.isCW = function(points) {
    var sum = 0;
    sum += (points[1].x - points[0].x) * (points[1].y + points[0].y);
    for (var i = 1; i < points.length; i++) {
        sum += (points[i].x - points[i - 1].x) * (points[i].y + points[i - 1].y);
    }
    sum += (points[0].x - points[points.length - 1].x) * (points[0].y + points[points.length - 1].y);
    if (sum >= 0) return false;
    return true;
};
Poly.prototype.isEdgeCW = function(e) {
    var sum = 0;
    var i = 0;
    var ed = e.next;
    sum += (ed.origin.x - e.origin.x) * (ed.origin.y + e.origin.y);
    while (ed.name !== e.name) {
        i++;
        sum += (ed.next.origin.x - ed.origin.x) * (ed.next.origin.y + ed.origin.y);
        ed = ed.next;
    }
    return (sum < 0);
};
Poly.prototype.pointEdgeLoop = function(edge, poly) {
    var ed = edge.next;
    edge.setPolygon(poly);
    while (ed.name !== edge.name) {
        ed.setPolygon(poly);
        ed = ed.next;
    }
};