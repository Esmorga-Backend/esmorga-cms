import paramiko
import sys
import io

build_package=sys.argv[1]
hostname=sys.argv[2]
server_path=sys.argv[3]
ssh_client = paramiko.SSHClient()

print("Deploying "+build_package+" to "+hostname+":"+server_path)

ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
if len(sys.argv)>4:
    key=sys.argv[4]
    print("SSH="+key[0:50]+"...")
    pkey = paramiko.RSAKey.from_private_key(io.StringIO(key))
    ssh_client.connect(hostname=hostname,port='22',username='ubuntu',pkey=pkey)
else:
    ssh_client.connect(hostname=hostname,port='22',username='ubuntu')

ftp_client=ssh_client.open_sftp()
ftp_client.put(build_package, build_package)

command = """
sudo rm -rf """+server_path+"""/* 
sudo unzip """+build_package+""" -d """+server_path+"""
sudo systemctl reload nginx
sleep 10
"""

stdin, stdout, stderr = ssh_client.exec_command(command)
for line in stdout.readlines():
    print(line)
ftp_client.close()
ssh_client.close()