class TestTask < Test::Unit::TestCase
  def test_create
    begin
      Context.eval('Aurora.task.create()')
    rescue => e
      p e.pretty_inspect
    end
    
    assert_not_nil(Context.eval('Aurora.task'),                                                                  'should exist a prototype named Aurora.task')
    assert_not_nil(Context.eval('Aurora.task.create()'),                                                         'should be an object after allocation')
    assert(Context.eval('Object.getPrototypeOf(Aurora.task.create()) == Aurora.task'),                           'should have Aurora.task as prototype')
    assert(Context.eval('Object.getPrototypeOf(Object.getPrototypeOf(Aurora.task.create())) == Aurora.object'),  'should have Aurora.object as super-prototype')
  end
  
  def test_task
    src = <<EOF
      Aurora.test = 0
      var o = Aurora.task.create(function () {
        Aurora.test += 1
      })
      
      o.start()
      o.stop()
      
      return Aurora.test
EOF
    
    assert(Context.exec(src) == 1, 'should have called once on start')
  end
end
