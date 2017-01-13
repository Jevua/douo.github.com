(define (pascal x y)
  (cond ((< x 0) 0)
        ((< y 0) 0)
        ((< y x) 0)
        ((and (= x 0) (= y 0)) 1)
        (else (+
               (pascal x (- y 1))
               (pascal (- x 1) (- y 1))
               )
              )
        )
  )
