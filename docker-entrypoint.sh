#!/bin/bash
set -e

# 检查必要的环境变量
required_vars=(
    "NEXT_PUBLIC_APP_ID"
    "NEXT_PUBLIC_APP_KEY"
    "NEXT_PUBLIC_API_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "错误: 环境变量 $var 未设置"
        exit 1
    fi
done

# 输出配置信息
echo "应用配置信息:"
echo "API URL: $NEXT_PUBLIC_API_URL"
echo "端口: $PORT"
echo "环境: $NODE_ENV"

exec "$@" 