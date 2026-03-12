#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
NODE="$(which node)"
NPM="$(which npm)"
USER="$(whoami)"

echo "Installing systemd services from: $DIR"

# Server service
cat > /etc/systemd/system/what-to-do-server.service <<EOF
[Unit]
Description=What To Do Swiper - Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$DIR/server
ExecStart=$NPM run dev
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Client service
cat > /etc/systemd/system/what-to-do-client.service <<EOF
[Unit]
Description=What To Do Swiper - Client
After=network.target what-to-do-server.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$DIR/client
ExecStart=$NPM run dev
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable what-to-do-server what-to-do-client
systemctl start what-to-do-server what-to-do-client

echo ""
echo "Done! Services installed and started."
echo "  systemctl status what-to-do-server"
echo "  systemctl status what-to-do-client"
