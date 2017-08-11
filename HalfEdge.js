function HalfEdge(v, name) {

    this.name = name;
    //this.Start = null;
    this.origin = v;
    //this.oppositeEdge = null;

    // Counter clock-wise
    this.next = null;
    this.prev = null;
    this.twin = null;
    this.helper = null;
    this.polygon = null;

}

HalfEdge.prototype.setNextEdge = function(he) {
    this.next = he;
};

HalfEdge.prototype.setPrevEdge = function(pe) {
    this.prev = pe;
};

HalfEdge.prototype.setTwin = function(e) {
    this.twin = e;
};

HalfEdge.prototype.setHelper = function(p) {
    this.helper = p;
};

HalfEdge.prototype.toHTML = function() {
    const pName = this.polygon ? this.polygon.getName() : '';
    return `<b>e${this.name}</b><br/> (${this.origin.getName()}, ${this.next.origin.getName()})<br/>${pName}`;
};

HalfEdge.prototype.getName = function() {
    return `e${this.name}`;
};
HalfEdge.prototype.setOrigin = function(v) {
    this.origin = v;
};
HalfEdge.prototype.setPolygon = function(p) {
    this.polygon = p;
};