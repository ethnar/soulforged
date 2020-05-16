const Connection = require("./.connection");

class RoomPath extends Connection {
  getDistance(creature) {
    return 3 * SECONDS;
  }

  installDoor(type) {
    const doors = new type();
    this.doors = doors;
    doors.path = this;

    const node1 = this.getFirstNode();
    const node2 = this.getSecondNode();

    if (node1.x === node2.x) {
      doors.nodeNorth = node1.y < node2.y ? node1 : node2;
      doors.nodeSouth = node1.y > node2.y ? node1 : node2;
    } else {
      doors.nodeWest = node1.x < node2.x ? node1 : node2;
      doors.nodeEast = node1.x > node2.x ? node1 : node2;
    }

    node1.addStructure(doors);
    node2.addStructure(doors);

    return doors;
  }

  getDoors() {
    return this.doors;
  }

  isInaccessible() {
    return this.doors && this.doors.isBlockingPath();
  }

  blocksVision() {
    return this.doors && this.doors.isBlockingVision();
  }
}
module.exports = global.RoomPath = RoomPath;
