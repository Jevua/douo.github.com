(define (tree-map proc tree)
  (map (lambda (item)
         (if (pair? item)
             (tree-map proc item)
             (proc item))
         )
       tree)
  )
