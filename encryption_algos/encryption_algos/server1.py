import socket
import tqdm
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad , unpad
import time


def receive_message(sock):
   
   header=sock.recv(4).decode()
   if not header:
     return None
   message_length=int(header)
   
   message=sock.recv(message_length).decode()
   return message  


server=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
address=('127.0.0.1',8174)
server.bind(address)
server.listen()
connection,client_address=server.accept()

message_from_client=receive_message(connection)
print(message_from_client)
AES_key=connection.recv(16)
message_from_client=receive_message(connection)
print(message_from_client)
AES_iv=connection.recv(16)




file_name=receive_message(connection)
file_size=receive_message(connection)

file_rcvd = open(file_name,"wb")

file_bytes=b""

done= False

progress =tqdm.tqdm(unit="B",unit_scale=True,colour='blue',unit_divisor=1000,total=int(file_size))

cipher=AES.new(AES_key,AES.MODE_CBC,AES_iv)

while not done:
    encrypted_data = connection.recv(1024)
    file_bytes += encrypted_data
    progress.update(len(encrypted_data))
    time.sleep(1)
    if b"<END>" in file_bytes:
        # Remove the end marker
        file_bytes = file_bytes.replace(b"<END>", b"")
        # Decrypt the padded data
        decrypted_data = cipher.decrypt(file_bytes)
        
        # Unpad the decrypted data
        unpadded_data = unpad(decrypted_data, AES.block_size)
        
        # Write the unpadded data to the file
        file_rcvd.write(unpadded_data)
        done = True
    
   

file_rcvd.close()

connection.close()
print("disconnected")
server.close()  






