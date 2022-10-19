#!/usr/bin/env node

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.array = this.removeDuplicates(this.mergeSort(array));
    this.root = this.buildTree(this.array, 0, this.array.length - 1);
  }

  // Function to sort an array of numbers using the mergesort algorithm
  mergeSort(array) {
    // Base case.
    // An array of zero or one elements is, by definition, already sorted.
    if (array.length <= 1) {
      return array;
    }
    // Recursive case.
    // Divide the list into equal-sized sublists
    // consisting of the first half and second half of the list.
    let leftArray = [];
    let rightArray = [];
    for (let i = 0; i < array.length; i += 1) {
      if (i < array.length / 2) {
        leftArray.push(array[i]);
      } else {
        rightArray.push(array[i]);
      }
    }
    // Recursively sort both sublists.
    leftArray = this.mergeSort(leftArray);
    rightArray = this.mergeSort(rightArray);

    // Merge the now-sorted sublists.
    return this.merge(leftArray, rightArray);
  }

  // Function used in recursive calls in the mergeSort function
  merge(leftArray, rightArray) {
    const resultArray = [];
    // Compare/sort the two lists while they're both not empty
    while (leftArray.length > 0 && rightArray.length > 0) {
      if (leftArray[0] <= rightArray[0]) {
        resultArray.push(leftArray.shift());
      } else {
        resultArray.push(rightArray.shift());
      }
    }
    // Either left or right may have elements left; consume them.
    // (Only one of the following loops will actually be entered.)
    while (leftArray.length > 0) {
      resultArray.push(leftArray.shift());
    }
    while (rightArray.length > 0) {
      resultArray.push(rightArray.shift());
    }
    return resultArray;
  }

  // Function to remove duplicates value in an array
  removeDuplicates(array) {
    return [...new Set(array)];
  }

  // Function to to build a balanced binary search tree from a sorted array with no duplicates
  buildTree(array, start, end) {
    // Base Case
    if (start > end || array.length === 0) {
      return null;
    }
    // Get the middle element and make it the root
    const middleElement = parseInt((start + end) / 2, 10); // parseInt converts a string to int, here in base 10
    const newNode = new Node(array[middleElement]);
    // Recursively construct the left subtree and make it left child of root
    newNode.left = this.buildTree(array, start, middleElement - 1);
    // Recursively construct the right subtree and make it right child of root
    newNode.right = this.buildTree(array, middleElement + 1, end);
    return newNode;
  }

  // Function to display the tree form in the console
  prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
      console.log("Root is null");
    } else {
      if (node.right !== null) {
        this.prettyPrint(
          node.right,
          `${prefix}${isLeft ? "│   " : "    "}`,
          false
        );
      }
      console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
      if (node.left !== null) {
        this.prettyPrint(
          node.left,
          `${prefix}${isLeft ? "    " : "│   "}`,
          true
        );
      }
    }
  }

  // Function to insert a new node given its value
  insert(value) {
    this.root = this.insertRecursive(this.root, value);
  }

  // Function to recursively insert a new node given a starting node and the target value
  insertRecursive(node, value) {
    // Base case
    if (node === null) {
      const newNode = new Node(value);
      return newNode;
    }

    // Otherwise, recur down the tree
    // If the value already exits, nothing is added
    if (value < node.value) {
      node.left = this.insertRecursive(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertRecursive(node.right, value);
    }

    return node;
  }

  // Function to delete a node given a target value
  delete(value) {
    this.root = this.deleteRecursive(this.root, value);
  }

  deleteRecursive(node, value) {
    // If node doesn't exist return null
    if (node === null) {
      return node;
    }
    // If value is smaller than the node value, recur to the left
    if (value < node.value) {
      node.left = this.deleteRecursive(node.left, value);
      // If value is larger than the node value, recur to the right
    } else if (node.value < value) {
      node.right = this.deleteRecursive(node.right, value);
      // If value is equal than the node value, it is the target node to be deleted
    } else {
      // If no left child exists, return right child
      if (node.left === null) {
        return node.right;
        // If no right child exists, return left child
      }
      if (node.right === null) {
        return node.left;
      }
      // If both children exist, change the value of the node
      // to the minimum value of any node of the right subtree
      node.value = this.getMinimumValue(node.right);
      // Then proceed to deleteRecursive on the node right child
      node.right = this.deleteRecursive(node.right, node.value);
    }
    return node;
  }

  // Function to get the minimum value in a tree given its root node
  getMinimumValue(node) {
    let minimumValue = node.value;
    let tempNode = node;
    while (tempNode.left !== null) {
      minimumValue = tempNode.left.value;
      tempNode = tempNode.left;
    }
    return minimumValue;
  }

  // Function to find and return a target node given a required value
  find(value) {
    return this.findRecursive(this.root, value);
  }

  // Function to recursively find and return a target node given a starting node and target value
  findRecursive(node, value) {
    if (node === null || node.value === value) {
      return node;
    }
    if (value < node.value) {
      return this.findRecursive(node.left, value);
    }
    return this.findRecursive(node.right, value);
  }

  // Function to level traverse the tree (breadth-first traversal)
  traverseLevelOrder(node, queue = [], result = []) {
    // Base case if root is null
    if (node === null) {
      return node;
    }
    result.push(node.value);
    if (node.left !== null) {
      queue.push(node.left);
    }
    if (node.right !== null) {
      queue.push(node.right);
    }

    while (queue.length > 0) {
      this.traverseLevelOrder(queue.shift(), queue, result);
    }
    return result;
  }

  // Function to preorder traverse the tree (depth-first traversal)
  traversePreOrder(node, result = []) {
    if (node !== null) {
      result.push(node.value);
      this.traverseInOrder(node.left, result);
      this.traverseInOrder(node.right, result);
    }
    return result;
  }

  // Function to inorder traverse the tree (depth-first traversal)
  traverseInOrder(node, result = []) {
    if (node !== null) {
      this.traverseInOrder(node.left, result);
      result.push(node.value);
      this.traverseInOrder(node.right, result);
    }
    return result;
  }

  // Function to postorder traverse the tree (depth-first traversal)
  traversePostOrder(node, result = []) {
    if (node !== null) {
      this.traverseInOrder(node.left, result);
      this.traverseInOrder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  // Function to determine the height of the binary tree
  // Height is defined as the number of edges in longest path from a given node to a leaf node.
  // Empty Tree returns -1
  // Root alone returns 0
  // Only one child returns 1
  height() {
    return this.heightRecursive(this.root);
  }

  // Function to recursively determine the height of a target node in the binary tree
  heightRecursive(node) {
    if (node === null) {
      return -1;
    }
    const leftHeight = this.heightRecursive(node.left);
    const rightHeight = this.heightRecursive(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  // Function to determine the depth of a node in the tree
  // Depth is defined as the number of edges in path from a given node to the tree’s root node.
  depth(targetNode) {
    return this.depthRecursive(this.root, targetNode);
  }

  // Function to recursively determine the depth of a target node to a given node
  depthRecursive(node, targetNode) {
    if (node === null) {
      return -1;
    }
    const distance = -1;

    if (node === targetNode) {
      return distance + 1;
    }
    if (this.depthRecursive(node.left, targetNode) >= 0) {
      return this.depthRecursive(node.left, targetNode) + 1;
    }
    if (this.depthRecursive(node.right, targetNode) >= 0) {
      return this.depthRecursive(node.right, targetNode) + 1;
    }

    return distance;
  }

  // Function to check if the tree is balanced
  // A balanced tree is one where the difference between heights of left subtree and
  // right subtree of every node is not more than 1.
  isBalanced() {
    if (this.isBalancedRecursive(this.root) <= -1) {
      return false;
    }
    return true;
  }

  // Function to recursively check if the tree is balanced given a root
  isBalancedRecursive(node) {
    if (node === null) {
      return 0;
    }
    const leftHeight = this.isBalancedRecursive(node.left);
    const rightHeight = this.isBalancedRecursive(node.right);
    const heightDifference = Math.abs(leftHeight - rightHeight);
    if (heightDifference > 1) {
      return -2;
    }
    return Math.max(leftHeight, rightHeight) + 1;
  }

  // Function to rebalance an unbalanced binary search tree
  rebalance() {
    if (this.isBalanced() === false) {
      // Fetch the inOrderTraveral array which is a sorted array
      const inOrderArray = this.traverseInOrder(this.root);
      // Rebuild the tree using the sorted array
      this.root = this.buildTree(inOrderArray, 0, inOrderArray.length - 1);
    }
    return this.root;
  }
}

const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// const arr = [];
const bst = new Tree(arr);
console.log(bst.array);
console.log(bst.root);
console.log(bst.prettyPrint(bst.root));
console.log(bst.insert(123));
console.log(bst.prettyPrint(bst.root));
console.log(bst.delete(8));
console.log(bst.prettyPrint(bst.root));
console.log(bst.traverseLevelOrder(bst.root));
console.log(bst.traversePreOrder(bst.root));
console.log(bst.traverseInOrder(bst.root));
console.log(bst.traversePostOrder(bst.root));
console.log(bst.height());
console.log(bst.depth(bst.find(4)));
console.log(bst.isBalanced());
const bst2 = new Tree([10]);
bst2.insert(8);
bst2.insert(20);
bst2.insert(5);
bst2.insert(9);
bst2.insert(30);
bst2.insert(25);
bst2.insert(28);
bst2.insert(27);
console.log(bst2.prettyPrint(bst2.root));
console.log(bst2.isBalanced());
console.log(bst2.prettyPrint(bst2.rebalance()));
