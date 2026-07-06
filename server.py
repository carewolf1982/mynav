import http.server
import socketserver
import sqlite3
import json
import urllib.parse
import os

PORT = 8080
DATABASE_PATH = 'nav.db'
ADMIN_PWD = '123456'

def get_db():
    return sqlite3.connect(DATABASE_PATH)

def handle_api_list():
    db = get_db()
    categories = db.execute('SELECT * FROM nav_category ORDER BY sort').fetchall()
    links = db.execute('SELECT * FROM nav_link ORDER BY sort').fetchall()
    stocks = db.execute('SELECT * FROM nav_stock ORDER BY sort').fetchall()
    db.close()
    
    cats = [{'id': c[0], 'name': c[1], 'sort': c[2]} for c in categories]
    link_list = [{'id': l[0], 'category_id': l[1], 'title': l[2], 'url': l[3], 'icon': l[4], 'desc': l[5], 'sort': l[6]} for l in links]
    stock_list = [{'id': s[0], 'code': s[1], 'name': s[2], 'sort': s[3]} for s in stocks]
    
    return json.dumps({'code': 0, 'data': {'categories': cats, 'links': link_list, 'stocks': stock_list}}, ensure_ascii=False)

def check_auth(auth_header):
    if not auth_header or auth_header != f'Bearer {ADMIN_PWD}':
        return False
    return True

def handle_api_link_post(body):
    try:
        data = json.loads(body)
        db = get_db()
        db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)',
                   (data.get('category_id'), data.get('title'), data.get('url'), 
                    data.get('icon', ''), data.get('desc', ''), data.get('sort', 0)))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '新增成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

def handle_api_link_put(body):
    try:
        data = json.loads(body)
        db = get_db()
        db.execute('UPDATE nav_link SET category_id=?,title=?,url=?,icon=?,desc=?,sort=? WHERE id=?',
                   (data.get('category_id'), data.get('title'), data.get('url'), 
                    data.get('icon', ''), data.get('desc', ''), data.get('sort', 0), data.get('id')))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '修改成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

def handle_api_link_delete(path):
    try:
        parsed = urllib.parse.urlparse('http://localhost' + path)
        id = urllib.parse.parse_qs(parsed.query).get('id', [None])[0]
        if not id:
            return json.dumps({'code': 400, 'msg': '缺少ID'}, ensure_ascii=False)
        db = get_db()
        db.execute('DELETE FROM nav_link WHERE id=?', (id,))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '删除成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

def handle_api_category_post(body):
    try:
        data = json.loads(body)
        db = get_db()
        db.execute('INSERT INTO nav_category(name,sort) VALUES(?,?)', (data.get('name'), data.get('sort', 0)))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '分类新增成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

def handle_api_category_put(body):
    try:
        data = json.loads(body)
        db = get_db()
        db.execute('UPDATE nav_category SET name=?,sort=? WHERE id=?', (data.get('name'), data.get('sort', 0), data.get('id')))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '分类修改成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

def handle_api_category_delete(path):
    try:
        parsed = urllib.parse.urlparse('http://localhost' + path)
        id = urllib.parse.parse_qs(parsed.query).get('id', [None])[0]
        if not id:
            return json.dumps({'code': 400, 'msg': '缺少ID'}, ensure_ascii=False)
        db = get_db()
        db.execute('DELETE FROM nav_link WHERE category_id=?', (id,))
        db.execute('DELETE FROM nav_category WHERE id=?', (id,))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '分类删除成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

def handle_api_stock_post(body):
    try:
        data = json.loads(body)
        db = get_db()
        db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', (data.get('code'), data.get('name'), data.get('sort', 0)))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '股票新增成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

def handle_api_stock_put(body):
    try:
        data = json.loads(body)
        db = get_db()
        db.execute('UPDATE nav_stock SET code=?,name=?,sort=? WHERE id=?', (data.get('code'), data.get('name'), data.get('sort', 0), data.get('id')))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '股票修改成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

def handle_api_stock_delete(path):
    try:
        parsed = urllib.parse.urlparse('http://localhost' + path)
        id = urllib.parse.parse_qs(parsed.query).get('id', [None])[0]
        if not id:
            return json.dumps({'code': 400, 'msg': '缺少ID'}, ensure_ascii=False)
        db = get_db()
        db.execute('DELETE FROM nav_stock WHERE id=?', (id,))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '股票删除成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

def handle_api_pwd_post(body):
    try:
        data = json.loads(body)
        db = get_db()
        db.execute("UPDATE nav_config SET value=? WHERE key='admin_pwd'", (data.get('newPwd'),))
        db.commit()
        db.close()
        return json.dumps({'code': 0, 'msg': '密码修改成功'}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({'code': 500, 'msg': str(e)}, ensure_ascii=False)

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def send_json_response(self, content, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(content.encode('utf-8'))
    
    def do_GET(self):
        if self.path.startswith('/api/'):
            if self.path == '/api/nav/list':
                self.send_json_response(handle_api_list())
                return
            else:
                self.send_json_response(json.dumps({'code': 404, 'msg': '接口不存在'}), 404)
                return
        
        return super().do_GET()
    
    def do_POST(self):
        if self.path.startswith('/api/'):
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            
            auth = self.headers.get('Authorization')
            
            if self.path == '/api/nav/list':
                self.send_json_response(handle_api_list())
                return
            
            if not check_auth(auth):
                self.send_json_response(json.dumps({'code': 403, 'msg': '密码错误'}), 403)
                return
            
            if self.path == '/api/nav/link':
                self.send_json_response(handle_api_link_post(body))
                return
            elif self.path == '/api/nav/category':
                self.send_json_response(handle_api_category_post(body))
                return
            elif self.path == '/api/nav/stock':
                self.send_json_response(handle_api_stock_post(body))
                return
            elif self.path == '/api/nav/pwd':
                self.send_json_response(handle_api_pwd_post(body))
                return
            else:
                self.send_json_response(json.dumps({'code': 404, 'msg': '接口不存在'}), 404)
                return
        
        self.send_response(404)
        self.end_headers()
    
    def do_PUT(self):
        if self.path.startswith('/api/'):
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            
            auth = self.headers.get('Authorization')
            
            if not check_auth(auth):
                self.send_json_response(json.dumps({'code': 403, 'msg': '密码错误'}), 403)
                return
            
            if self.path == '/api/nav/link':
                self.send_json_response(handle_api_link_put(body))
                return
            elif self.path == '/api/nav/category':
                self.send_json_response(handle_api_category_put(body))
                return
            elif self.path == '/api/nav/stock':
                self.send_json_response(handle_api_stock_put(body))
                return
            else:
                self.send_json_response(json.dumps({'code': 404, 'msg': '接口不存在'}), 404)
                return
        
        self.send_response(404)
        self.end_headers()
    
    def do_DELETE(self):
        if self.path.startswith('/api/'):
            auth = self.headers.get('Authorization')
            
            if not check_auth(auth):
                self.send_json_response(json.dumps({'code': 403, 'msg': '密码错误'}), 403)
                return
            
            if self.path.startswith('/api/nav/link'):
                self.send_json_response(handle_api_link_delete(self.path))
                return
            elif self.path.startswith('/api/nav/category'):
                self.send_json_response(handle_api_category_delete(self.path))
                return
            elif self.path.startswith('/api/nav/stock'):
                self.send_json_response(handle_api_stock_delete(self.path))
                return
            else:
                self.send_json_response(json.dumps({'code': 404, 'msg': '接口不存在'}), 404)
                return
        
        self.send_response(404)
        self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        self.end_headers()

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()