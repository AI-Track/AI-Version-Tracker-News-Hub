package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"strings"
)

// 验证代码结构和完整性
func main() {
	fmt.Println("🔍 验证后端代码结构...")

	// 检查关键文件是否存在
	requiredFiles := []string{
		"cmd/main.go",
		"internal/config/config.go",
		"internal/database/mongodb.go",
		"internal/database/mysql.go",
		"internal/database/redis.go",
		"internal/model/user.go",
		"internal/model/article.go",
		"internal/model/request.go",
		"internal/repository/user_repository.go",
		"internal/repository/article_repository.go",
		"internal/service/auth_service.go",
		"internal/service/news_service.go",
		"internal/handler/auth_handler.go",
		"internal/handler/news_handler.go",
		"internal/middleware/auth.go",
		"internal/middleware/cors.go",
		"internal/util/jwt.go",
		"internal/util/password.go",
		"go.mod",
		"Dockerfile",
	}

	missing := []string{}
	for _, file := range requiredFiles {
		if _, err := os.Stat(file); os.IsNotExist(err) {
			missing = append(missing, file)
		}
	}

	if len(missing) > 0 {
		fmt.Println("❌ 缺失关键文件:")
		for _, file := range missing {
			fmt.Printf("   - %s\n", file)
		}
	} else {
		fmt.Println("✅ 所有关键文件存在")
	}

	// 验证Go代码语法
	fmt.Println("\n🔍 验证Go代码语法...")
	err := validateGoSyntax(".")
	if err != nil {
		fmt.Printf("❌ 语法错误: %v\n", err)
	} else {
		fmt.Println("✅ 语法验证通过")
	}

	// 检查API端点
	fmt.Println("\n🔍 检查API端点定义...")
	endpoints := checkAPIEndpoints()
	fmt.Printf("✅ 发现 %d 个API端点:\n", len(endpoints))
	for _, endpoint := range endpoints {
		fmt.Printf("   - %s\n", endpoint)
	}

	// 检查数据模型
	fmt.Println("\n🔍 检查数据模型...")
	models := checkDataModels()
	fmt.Printf("✅ 发现 %d 个数据模型:\n", len(models))
	for _, model := range models {
		fmt.Printf("   - %s\n", model)
	}

	// 检查依赖
	fmt.Println("\n🔍 检查依赖配置...")
	deps := checkDependencies()
	fmt.Printf("✅ 发现 %d 个依赖包:\n", len(deps))
	for _, dep := range deps {
		fmt.Printf("   - %s\n", dep)
	}

	fmt.Println("\n🎉 代码验证完成!")
}

func validateGoSyntax(root string) error {
	return filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !strings.HasSuffix(path, ".go") {
			return nil
		}

		// 跳过vendor和隐藏目录
		if strings.Contains(path, "vendor/") || strings.Contains(path, "/.") {
			return nil
		}

		fset := token.NewFileSet()
		_, err = parser.ParseFile(fset, path, nil, parser.ParseComments)
		if err != nil {
			return fmt.Errorf("文件 %s: %v", path, err)
		}

		return nil
	})
}

func checkAPIEndpoints() []string {
	endpoints := []string{}
	
	// 从main.go中提取路由定义
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, "cmd/main.go", nil, parser.ParseComments)
	if err != nil {
		return endpoints
	}

	ast.Inspect(file, func(n ast.Node) bool {
		if call, ok := n.(*ast.CallExpr); ok {
			if sel, ok := call.Fun.(*ast.SelectorExpr); ok {
				if sel.Sel.Name == "POST" || sel.Sel.Name == "GET" || 
				   sel.Sel.Name == "PUT" || sel.Sel.Name == "DELETE" {
					if len(call.Args) > 0 {
						if basic, ok := call.Args[0].(*ast.BasicLit); ok {
							endpoint := fmt.Sprintf("%s %s", sel.Sel.Name, basic.Value)
							endpoints = append(endpoints, endpoint)
						}
					}
				}
			}
		}
		return true
	})

	return endpoints
}

func checkDataModels() []string {
	models := []string{}
	
	modelFiles := []string{
		"internal/model/user.go",
		"internal/model/article.go",
		"internal/model/request.go",
	}

	for _, file := range modelFiles {
		fset := token.NewFileSet()
		astFile, err := parser.ParseFile(fset, file, nil, parser.ParseComments)
		if err != nil {
			continue
		}

		for _, decl := range astFile.Decls {
			if gen, ok := decl.(*ast.GenDecl); ok && gen.Tok == token.TYPE {
				for _, spec := range gen.Specs {
					if ts, ok := spec.(*ast.TypeSpec); ok {
						models = append(models, ts.Name.Name)
					}
				}
			}
		}
	}

	return models
}

func checkDependencies() []string {
	deps := []string{}
	
	content, err := os.ReadFile("go.mod")
	if err != nil {
		return deps
	}

	lines := strings.Split(string(content), "\n")
	inRequire := false
	
	for _, line := range lines {
		line = strings.TrimSpace(line)
		
		if strings.HasPrefix(line, "require") {
			inRequire = true
			continue
		}
		
		if inRequire {
			if line == ")" {
				break
			}
			if line != "" && !strings.HasPrefix(line, "//") {
				parts := strings.Fields(line)
				if len(parts) >= 1 {
					deps = append(deps, parts[0])
				}
			}
		}
	}

	return deps
} 