#!/bin/bash

# 设置变量
PLATFORM=$1
CUSTOM_ENV_FILE=$2  # 可选：指定自定义环境变量文件

# 显示帮助信息
show_help() {
  echo "Electron Vue3 应用 Docker 构建工具"
  echo ""
  echo "用法: ./docker-build.sh <命令> [自定义环境变量文件]"
  echo ""
  echo "说明: "
  echo "  系统默认使用项目根目录的 .env 文件加载环境变量。"
  echo "  您可以选择指定一个自定义的环境变量文件，如 .env.production。"
  echo "  构建架构由 electron-builder.json 文件直接控制。"
  echo ""
  echo "命令:"
  echo "  win, linux, mac, all    构建指定平台的应用"
  echo ""
  echo "参数:"
  echo "  [自定义环境文件]        可选: 自定义环境变量文件的路径，如 .env.prod"
  echo ""
  echo "示例:"
  echo "  ./docker-build.sh win          # 构建Windows版本"
  echo "  ./docker-build.sh down         # 清理构建环境"
}

# 检查平台或命令参数
if [ -z "$PLATFORM" ]; then
  show_help
  exit 1
fi

# 加载环境变量文件
if [ -n "$CUSTOM_ENV_FILE" ] && [ -f "$CUSTOM_ENV_FILE" ]; then
  echo "🔧 加载自定义环境变量文件: $CUSTOM_ENV_FILE"
  export $(grep -v '^#' $CUSTOM_ENV_FILE | xargs)
elif [ -f ".env" ]; then
  echo "🔧 加载默认环境变量文件: .env"
  export $(grep -v '^#' .env | xargs)
else
  echo "⚠️  警告: 未找到.env文件，将使用默认值或命令行传入的环境变量"
fi

# 检查并设置缺失的必要环境变量的默认值
: ${NPM_MIRROR:="https://registry.npmmirror.com"}
: ${BUILD_TYPE:="prod"}
: ${USE_NON_ROOT:="false"}
: ${OUTPUT_PERMISSION:="777"}
: ${OUTPUT_DIR_WIN:="release/win"}
: ${OUTPUT_DIR_LINUX:="release/linux"}
: ${OUTPUT_DIR_MAC:="release/mac"}

# 根据命令执行不同的操作
case "$PLATFORM" in
  win|linux|mac|all)
    # 运行前，显示配置信息
    echo "🚀 开始构建 Electron Vue3 应用..."
    echo "⚙️  平台: $PLATFORM"
    echo "⚙️  构建类型: $BUILD_TYPE"
    echo "📦 NPM镜像: $NPM_MIRROR"
    echo "👤 使用非root用户: $USE_NON_ROOT"
    echo "🔒 输出文件权限: $OUTPUT_PERMISSION"
    echo "📂 输出目录:"
    echo "   - Windows: $OUTPUT_DIR_WIN"
    echo "   - Linux:   $OUTPUT_DIR_LINUX"
    echo "   - macOS:   $OUTPUT_DIR_MAC"
    echo ""

    if [ "$PLATFORM" = "all" ]; then
      echo "🏗️  构建所有平台..."
      docker-compose up --build build-all
    elif [ "$PLATFORM" = "win" ]; then
      echo "🏗️  构建Windows版本..."
      docker-compose up --build build-windows
    elif [ "$PLATFORM" = "linux" ]; then
      echo "🏗️  构建Linux版本..."
      docker-compose up --build build-linux
    elif [ "$PLATFORM" = "mac" ]; then
      echo "🏗️  构建macOS版本..."
      docker-compose up --build build-mac
    fi

    # 检查上一个命令的退出码
    if [ $? -eq 0 ]; then
      echo ""
      echo "✅ 构建成功完成!"
      echo "📦 构建产物位置:"
      if [ "$PLATFORM" = "all" ] || [ "$PLATFORM" = "win" ]; then
        echo "   - Windows产物路径: ${OUTPUT_DIR_WIN}/"
      fi
      if [ "$PLATFORM" = "all" ] || [ "$PLATFORM" = "linux" ]; then
        echo "   - Linux产物路径: ${OUTPUT_DIR_LINUX}/"
      fi
      if [ "$PLATFORM" = "all" ] || [ "$PLATFORM" = "mac" ]; then
        echo "   - macOS产物路径: ${OUTPUT_DIR_MAC}/"
      fi
      exit 0
    else
      echo "❌ 构建失败!"
      exit 1
    fi
    ;;

  *)
    echo "❌ 错误: 不支持的命令 '$PLATFORM'"
    show_help
    exit 1
    ;;
esac 