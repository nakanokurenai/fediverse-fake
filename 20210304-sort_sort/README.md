# sort.Slice を非破壊的にしたいときってどうすればいいの

https://blog.golang.org/slices-intro

答。`[len]type` を参照として持つものなので copy でちゃんとコピーしましょう
