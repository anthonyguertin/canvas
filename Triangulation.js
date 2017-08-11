function Triangulation(polygon) {

	var polygonPoints = polygon.getPoints();

	this.poly = new Poly();
	this.poly.makeFromPointArray(polygonPoints);
	
	this.edges = [];
	this.points = [];
	this.Tree = [];

	this.makeMonotone = function() {

		var points = this.poly.getPoints();
		var edges = this.poly.getEdges();
		points = points.sort((a, b) => {
			return  a.y === b.y ? (a.x) - (b.x) : (a.y) - (b.y); 
		});

		for(var i=0; i < points.length; i++){
			var type = this.determinePointType(points[i]);

			switch(type){
				case __vertextType.start:
					this.startVertex(points[i]);
					break;
				case __vertextType.end:
					this.endVertex(points[i]);
					break;
				case __vertextType.split:
					this.splitVertex(points[i]);
					break;
				case __vertextType.regular:
					this.regularVertex(points[i]);
					break;
				case __vertextType:
					this.mergeVertex(points[i]);
					break;
			}
			//console.log(i, this.treeToString());
			//if(i==5) break;
		}
	}


	this.getEdges = () => {
		return this.poly.getEdges();
	}
	this.getPoints = () => {
		return this.poly.getPoints();
	}
	this.getPoly = () => {
		return this.poly;
	}

	this.determinePointType = (p) => {
		var left = p.edge.next.origin;
		var right = p.edge.prev.origin;

		if (this.isLower(p, left) && this.isLower(p, right)) {
			if (this.isCCW(left, p, right)) {
				return __vertextType.start;
			} else {
				return __vertextType.split;	
			}
		}
		else if (this.isLower(left, p) && this.isLower(right, p)) {
			if (this.isCCW(left, p, right)){
				return __vertextType.endVertex;
			} else {
				return __vertextType.mergeVertex;	
			}
		}
		else{
			return __vertextType.regular;
		}
	}

	this.startVertex = (p) => {
		this.Tree.push(p.edge);
		p.edge.setHelper(p);
	}

	this.endVertex = function(p){
		if (this.determinePointType(p.edge.prev.helper) == __vertextType.merge) {
			this.poly.addDiagonal(p, p.edge.prev.helper);
		}
		this.Tree.splice(this.treeIndexOfEdge(p.edge.prev), 1);
	}

	this.splitVertex = function(p) {
		var edgeToTheLeft = this.getEdgeToLeft(p);
		this.poly.addDiagonal(p, edgeToTheLeft.helper);
		edgeToTheLeft.setHelper(p);
		this.Tree.push(p.edge);
		p.edge.setHelper(p);
	}

	this.mergeVertex = function(p) {
		//console.log("p.edge.prev.helper: "+this.determinePointType(p.edge.prev.helper));
		var pType = this.determinePointType(p.edge.prev.helper);
		if (pType === null) { return; }
		
		if (pType === 'mergeVertex') {
			//console.log("bob");
			this.poly.addDiagonal(p, p.edge.prev.helper);
		}
		this.Tree.splice(this.treeIndexOfEdge(p.edge.prev), 1);
		//console.log("tree: "+this.treeToString());
		var edgeToTheLeft = this.getEdgeToLeft(p);
		if (edgeToTheLeft === null) { return; }
		//console.log("edgeToTheLeft.helper.name: "+edgeToTheLeft.helper.name);
		if(this.determinePointType(edgeToTheLeft.helper) === 'mergeVertex') {
			//console.log()
			this.poly.addDiagonal(p, edgeToTheLeft.helper);
		}
		edgeToTheLeft.setHelper(p);
	}

	this.regularVertex = function(p) {
		//polygon is to the right, edge is left side
		if (p.edge.next.origin.y > p.y ||
			(p.edge.next.origin.y === p.y && p.edge.next.origin.x > p.x)) {
			let pType = this.determinePointType(p.edge.prev.helper)

			if (pType === null) { return; }
			if (pType === 'mergeVertex') {
				this.poly.addDiagonal(p, p.edge.prev.helper);
			}
			this.Tree.splice(this.treeIndexOfEdge(p.edge.prev), 1);
			this.Tree.push(p.edge);
			p.edge.setHelper(p);
		} else { //edge on right side. polygon innards to the left
			//console.log("right");
			var edgeToTheLeft = this.getEdgeToLeft(p);
			if (edgeToTheLeft === null) { return; }

			let pType = this.determinePointType(edgeToTheLeft.helper);
			if (pType === 'mergeVertex') {
				this.poly.addDiagonal(p, edgeToTheLeft.helper);
			}
			edgeToTheLeft.setHelper(p);
		}
	}

	this.getHelperVertex = function(p) {
		return this.getEdgeToLeft(p).helper;
	}

	this.treeIndexOfEdge = function(e) {
		for(var i=0; i<this.Tree.length; i++) {
			if(this.Tree[i].origin == e.origin) return i;
		}
		return -1;
	}
	this.getEdgeToLeft = function(p) {
		//loop from the right side
		for(var i=this.Tree.length; i--; ) {
			//origin is above point. origin is to the left of point
			//console.log(Tree[i].origin.y, p.y, Tree[i].origin.x, p.x)
			if(this.Tree[i].origin.y < p.y && (this.Tree[i].origin.x < p.x || this.Tree[i].next.origin.x < p.x)){
				//return the first success.
				return this.Tree[i];
			}
		}
		console.log(`died: ${p.name}, ${this.treeToString()}`);
	}

	this.treeToString = function() {
		var r = '';
		for(let i = 0; i < this.Tree.length; i++) {
			r += `${this.Tree[i].name}:${this.Tree[i].helper.name}, `;
		}
		return r;
	}

	this.isLower = function(i, j) {
		if(i.y < j.y || (i.y == j.y && i.x < j.x))
			return true;
		else
			return false;
	};

	this.isCCW = function(i, j, k) {
		var det = ((j.x-i.x)*(k.y-i.y) - (j.y-i.y)*(k.x-i.x));
		return (det >= 0);
	};

}
