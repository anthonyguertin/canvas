function BinarySearchTree() {
  this.root = null;
}

BinarySearchTree.prototype.insert = (val) => {
   var root = this.root;

   if (!root) {
      this.root = new Node(val);
      return;
   }

   var currentNode = root;
   var newNode = new Node(val); 

    while (currentNode) {
        if (val < currentNode.val) {
            if (!currentNode.left) {
                currentNode.left = newNode;
                break;
            } else {
                currentNode = currentNode.left;
            }
        } else {
            if (!currentNode.right) {
                currentNode.right = newNode;
                break;
            } else {
                currentNode = currentNode.right;
            }
        }
    }
}

BinarySearchTree.prototype.remove = (val) => {
    this.root = this._removeInner(val, this.root);
}

BinarySearchTree.prototype._removeInner = (val, node) => {
    if (node) {
        if (val < node.val) {
            node.left = this._removeInner(e, node.left);
        } else if (e > node.val) {
            node.right = this._removeInner(val, node.right);
        } else if (node.left && node.right) {
            node.val = this.findMinval(node.right);
            node.right = this._removeInner(node.val, node.right);
        } else {
            node = node.left || node.right;
        }
    }
    return node;
}