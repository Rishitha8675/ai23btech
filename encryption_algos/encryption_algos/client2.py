import socket
import os
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad , unpad
import rsa


def send_message(sock,message):
    
    message_length=len(message)
    message_with_header=f"{message_length:04d}"+message
    
    sock.send(message_with_header.encode())
    


client=socket.socket(socket.AF_INET,socket.SOCK_STREAM)

server_address=('127.0.0.1',8174)
client.connect(server_address)


AES_key = get_random_bytes(16)
AES_iv = get_random_bytes(16)


with open("public.pem","rb") as f:
   public_key=rsa.PublicKey.load_pkcs1(f.read())
   
encrypted_AES_key=rsa.encrypt(AES_key,public_key)
encrypted_AES_iv=rsa.encrypt(AES_iv,public_key)  

file_to_be_sent=open("file.txt",'rb')
file_size=os.path.getsize("file.txt")


data=file_to_be_sent.read()
padded_data=pad(data,AES.block_size)
cipher=AES.new(AES_key,AES.MODE_CBC,AES_iv)
encrypted_data=cipher.encrypt(padded_data) 

print("Contacting with server:")

send_message(client,"Sending you the Encrypted AES Key")
client.send(encrypted_AES_key)
print("Encrypted AES key sent to the server")
send_message(client,"Sending you the Encrypted AES iv")
client.send(encrypted_AES_iv) 
print("Encrypted AES key sent to the server") 


send_message(client,"file2.txt")
send_message(client,str(file_size))
client.send(encrypted_data)
client.send(b"<END>")

print("connection_ended")
file_to_be_sent.close()
client.close()































