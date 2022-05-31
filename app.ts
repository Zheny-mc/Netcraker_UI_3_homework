import * as readlineSync from "readline-sync";

class BinarySearchTreeNode<T> {
  data: T;
  leftNode?: BinarySearchTreeNode<T>;
  rightNode?: BinarySearchTreeNode<T>;

  constructor(data: T) {
    this.data = data;
  }
}

class BinarySearchTree<T> {
  root?: BinarySearchTreeNode<T>;
  comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this.comparator = comparator;
  }

  insert(data: T): BinarySearchTreeNode<T> | undefined {
    if (!this.root) {
      this.root = new BinarySearchTreeNode(data);
      return this.root;
    }

    let current = this.root;

    while (true) {
      if (this.comparator.run(data, current.data) === 1) {
        if (current.rightNode) {
          current = current.rightNode;
        } else {
          current.rightNode = new BinarySearchTreeNode(data);
          return current.rightNode;
        }
      } else {
        if (current.leftNode) {
          current = current.leftNode;
        } else {
          current.leftNode = new BinarySearchTreeNode(data);
          return current.leftNode;
        }
      }
    }
  }

  search(data: T): BinarySearchTreeNode<T> | undefined {
    if (!this.root) return undefined;

    let current = this.root;

    while (this.comparator.run(data, current.data) !== 0) {
      if (this.comparator.run(data, current.data) === 1) {
        if (!current.rightNode) return;

        current = current.rightNode;
      } else {
        if (!current.leftNode) return;

        current = current.leftNode;
      }
    }

    return current;
  }

  //--------------------------------------------------
  traverse(root: BinarySearchTreeNode<T>, cb: Function) {
    if (root && root.data) {
      cb(root);
      this.traverse(root.rightNode, cb);
      this.traverse(root.leftNode, cb);
    }
  }
  
  findParentOfToBeDeletedNode(root: BinarySearchTreeNode<T>, data: T): BinarySearchTreeNode<T> {
    let node = root;
    const cb = root => {
      if (
        root &&
        ((root.rightNode && root.rightNode.data === data) ||
          (root.leftNode && root.leftNode.data === data))
      )
        node = root;
    };
    this.traverse(root, cb);
    return node;
  };

  _deleteNode(root: BinarySearchTreeNode<T>, data: T) {
    let parent = this.findParentOfToBeDeletedNode(root, data);
    let node = this.search(data);
  
    // leaves
    if (node.leftNode === undefined && node.rightNode === undefined) {
      // node with no child
      if (parent.leftNode?.data === node.data) {
        parent.leftNode = undefined;
      } else if (parent.rightNode?.data === node.data) {
        parent.rightNode = undefined;
      }
    } else if (node.leftNode === undefined && node.rightNode !== undefined) {
      // node with 1 child
      if (parent.leftNode?.data === node.data) {
        parent.leftNode = node.rightNode;
      } else if (parent.rightNode?.data === node.data) {
        parent.rightNode = node.rightNode;
      }
    } else if (node.leftNode !== undefined && node.rightNode === undefined) {
      // node with 1 child
      if (parent.leftNode?.data === node.data) {
        parent.leftNode = node.leftNode;
      } else if (parent.rightNode?.data === node.data) {
        parent.rightNode = node.leftNode;
      }
    } else if (node.leftNode && node.rightNode) {
      // node with 2 children
      // find the min in the subtree
      // and swap it with the data that would be deleted
      let min = node.rightNode.data;
      let pointer = node.rightNode;
      while (pointer) {
        min = pointer.data;
        pointer = pointer.leftNode;
      }
  
      // Delete the duplicate
      this._deleteNode(node, min);
  
      node.data = min;
    }
  };

  deleteNode(data: T) {
    this._deleteNode(this.root, data);
  }


  //--------------------------------------------------


  inOrderTraversal(node: BinarySearchTreeNode<T> | undefined): void {
    if (node) {
      this.inOrderTraversal(node.leftNode);
      console.log(node.data);
      this.inOrderTraversal(node.rightNode);
    }
  }
}

class Comparator<T> {
  run(a: T, b: T) {
    if (a < b) return -1;

    if (a > b) return 1;

    return 0;
  }
}

// -----------test binary tree----------------
const bst = new BinarySearchTree(new Comparator<number>());

console.log("Creating a Binary Tree:\nEnter numbers infinitely!\nIf you want to finish typing, enter: 0");
let res: number = readlineSync.question('number: ');
while (res != 0) {
    bst.insert(res);
    res = readlineSync.question('number: ');
}  
console.log("------------------вывод дерева-------------------");
bst.inOrderTraversal(bst.root);

bst.deleteNode(5)

console.log("------------------вывод дерева-------------------");
bst.inOrderTraversal(bst.root);



