interface SocketUser {
  socketId: string;
  id: string;
}

export const roomMap: { [key: string]: SocketUser[] } = {};
