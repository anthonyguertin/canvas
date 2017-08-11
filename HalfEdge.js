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

HalfEdge.prototype.setNextEdge = (he) => {
    this.next = he;
};

HalfEdge.prototype.setPrevEdge = (pe) => {
    this.prev = pe;
};

HalfEdge.prototype.setTwin = (e) => {
    this.twin = e;
};

HalfEdge.prototype.setHelper = (p) => {
    this.helper = p;
};

HalfEdge.prototype.toHTML = () => {
    const pName = this.polygon ? this.polygon.getName() : string.Empty;
    return `<b>e${this.name}</b><br/> (${this.origin.getName()}, ${this.next.origin.getName()})<br/>${pName}`;
};

HalfEdge.prototype.getName = () => {
    return `e${this.name}`;
};
HalfEdge.prototype.setOrigin = (v) => {
    this.origin = v;
};
HalfEdge.prototype.setPolygon = (p) => {
    this.polygon = p;
};