# Best of Reddit Video Generator
Este é um projeto feito em _JavaScript_ que, quando fornecido um _SubReddit_ e um _timeframe_ especifico, gera um video com os melhores clipes obtidos e faz o seu _upload_ para o _Youtube_. Exemplos de videos gerados com este projeto podem ser vistos [neste canal](https://www.youtube.com/channel/UCyzg_nePSZ0p70UYdn3kztQ).

# Como funciona

1. O programa vai pedir para introduzir o _SubReddit_ do qual ele vai buscar os _top posts_
2. O programa vai pedir para introduzir o _timeframe_ dos _posts_ (ou seja, se vai buscar os _top posts_ da ultima hora, do ultimo dia, semana, etc.)
3. O programa vai fazer o download do conteúdo de video dos _top posts_ do _SubReddit_ escolhido no _timeframe_ especificado, desde que estes cumpram determinados requisitos (os videos não podem conter nudez ou imagens gráficas, verificado através da _flair NSFW_; os posts devem ser videos, os videos não podem durar mais que 1 minuto, etc.). Estes requisitos podem ser mudados no ficheiro _.env_
4. Após ser feito o _download_ dos videos destes posts, o programa vai individualmente juntar as componentes de video ás de audio, verificar a resolução dos videos (aplicando barras laterais caso estes não sejam 16:9) e adiciona o titulo dos posts originais ao video, no canto inferior esquerdo.
5. O programa então cria uma lista com todos os clipes finais editados, clipes esses que são posteriormente combinados e juntos num único video final.
6. O programa vai pedir ao utilizador para fazer a autenticação na sua conta do _youtube_ de modo a fazer _upload_ do video final no canal selecionado. Vai pedir ao utilizador também para inserir o titulo do video, vai criar uma descrição com detalhes sobre os _posts_ originários do video (com os seus autores, titulos e _links_ para os próprios posts), vai aplicar certas _tags_ ao video e finalmente fazer o seu upload no youtube, sendo este video posteriormente adicionado a uma _playlist_ correspondente ao _SubReddit_ utilizado (criando uma _playlist_ caso esta ainda não exista)

# _FrameWorks_ e bibliotecas principais usadas

- **_FFMPEG_** - _framework_ usada na edição dos videos utilizados fazendo neste projeto:
  - O _merge_ de ficheiros _.mp3_ com ficheiros _.mp4_ (juntando assim as componentes de aúdio de um clip à de video)
  - A verificação da resolução dos ficheiros de video e sua mudança através do uso de _blurred sidebars_
  - A adição de texto personalizado aos videos gerados
  - O _merge_ de diversos clipes de video diferentes de modo a criar um video final.
- **_Googleapis_** - biblioteca usada na comunicação entre o programa com a _API_ do _Youtube_ de modo a:
  - Fazer upload de um video para o youtube
  - Gestão de _playlists_ de videos do youtube

# Requisitos para rodar o programa

- Instalação do [_FFMPEG_](https://www.ffmpeg.org/download.html) (PS: Pode ser necessária a adição da pasta do _FFMPEG_ ás variáveis de ambiente do computador, que para o caso deixo aqui um [tutorial](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/))
- É necessário um ficheiro _JSON_ com as credenciais _oAuth_ para o _upload_ dos videos. Este pode ser obtido no _Google Cloud_ através dos passos mencionados [neste repositório](https://github.com/filipedeschamps/video-maker#api-youtube)

# Inspiração

Este projeto foi inspirado nos canais [GloomShot](https://www.youtube.com/c/GloomshotFightingGames/channels) e no projeto [video-maker](https://github.com/filipedeschamps/video-maker) de Filipe Deschamps.
