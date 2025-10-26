import socket, json, os

SOCKET_PATH = "/tmp/api_observer.sock"

# limpiar socket viejo
if os.path.exists(SOCKET_PATH):
    os.remove(SOCKET_PATH)

#server = socket.create_server(SOCKET_PATH, family = socket.AF_UNIX)
server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
server.bind(SOCKET_PATH)
os.chmod(SOCKET_PATH, 999)
server.listen()

print("🟢 Escuchando notificaciones desde PHP...")

while True:
    conn, _ = server.accept()
    data = conn.recv(1024)
    if data:
        print(data)
    conn.close()