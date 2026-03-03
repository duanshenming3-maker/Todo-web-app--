// 引入 express 框架
const express = require("express");

// 用于处理文件路径
const path = require("path");

// 创建一个 express 应用
const app = express();

// 让服务器可以解析 JSON 请求体
// 比如前端发送 { text: "xxx" }
app.use(express.json());

/*
===============================
  模拟数据库（内存存储）
===============================
*/

// 用数组来存储 todo
let todos = [
  { id: 1, text: "Buy milk", done: false },
  { id: 2, text: "Learn VS Code", done: true },
];

// 下一个 todo 的 id
let nextId = 3;

/*
===============================
  API 接口
===============================
*/

// 获取所有 todo
app.get("/api/todos", (req, res) => {
  res.json(todos); // 返回 JSON 数据
});

// 新建一个 todo
app.post("/api/todos", (req, res) => {
  // 从请求体中获取 text
  const text = (req.body?.text || "").trim();

  // 如果 text 为空，返回错误
  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }

  // 创建新 todo 对象
  const todo = {
    id: nextId++,
    text: text,
    done: false,
  };

  // 添加到数组前面
  todos.unshift(todo);

  // 返回创建成功
  res.status(201).json(todo);
});

// 修改 todo（完成 / 修改内容）
app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  // 找到对应的 todo
  const t = todos.find((x) => x.id === id);

  if (!t) {
    return res.status(404).json({ error: "not found" });
  }

  // 如果前端传了 done 字段
  if (typeof req.body.done === "boolean") {
    t.done = req.body.done;
  }

  // 如果前端传了 text 字段
  if (typeof req.body.text === "string") {
    t.text = req.body.text.trim() || t.text;
  }

  res.json(t);
});

// 删除 todo
app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  // 过滤掉对应 id
  todos = todos.filter((x) => x.id !== id);

  res.status(204).end(); // 删除成功
});

/*
===============================
  让服务器可以访问前端文件
===============================
*/

// public 文件夹里的文件可以被访问
app.use(express.static(path.join(__dirname, "public")));

/*
===============================
  启动服务器
===============================
*/

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});