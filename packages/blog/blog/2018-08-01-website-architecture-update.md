---
title: A Year of Change - Reflection on My Website's Architecture Update
tags: [design-choices]
---

### Background

I bought the domain [developersam.com](https://developersam.com){:target="\_blank"} in February 2015
and officially started my own website. Before that, I hosted my website on the free tk domain, but I
decided to remove that kind of sketchiness when I received my first scholarship. The website is
poorly maintained, received no update for almost a year since it's published. After I was admitted
to Cornell in December 2016, I started to update my website more often, but still not as frequent as
I would do right now. In a quite slow progress, the website finally got to an acceptable shape at
the end of July last year.

<!--truncate-->

Here shows the original website:

![Original Website](/img/2018-08-01-website-architecture-update/very-old.png)

Since its initial set up and until now, the website is on the JVM stack. Although I was using PHP
for my school's club's project, it was done for legacy code reasons. I chose JVM stack for my own
website to give it a fresh start with the benefits of static type checking and easy-to-use
object-oriented features.

The website was hosted on Google App Engine, the only reliable and well-known PaaS that was
effectively free for small personal websites. I forced myself to learn Java a long time ago simply
because I want to host my website free of charge and GAE only supported Python and Java at that
time.

### What's Running on My Website A Year Ago

In the summer holidays before going to Cornell, I had a lot of free time and performed a large-scale
update on my website. Some small gadget-like apps using deprecated Google Cloud APIs had been
removed; the frontend JS code had been rewritten to improve readability; more importantly, I wrote
a small library to generate HTML and CSS code for some material design components, supported by the
[Material Design Lite](https://getmdl.io/) library.

Here is how my website looks a year ago:

![Website A Year Ago](/img/2018-08-01-website-architecture-update/old.png)

The frontend code generation is actually not fancy at all. It's not like SSR for React or Angular;
it's SSR done by the almost dead technology called
[JSTL](http://www.oracle.com/technetwork/java/index-jsp-135995.html) on JSP. It worked at the time
it was built because my website only contains simple stuff, mostly static content.

I also developed a blog engine for my website that is technologically simple and notoriously hard
to use for ordinary users. You basically wrote your blog post in plain HTML in a designated folder
of the app. Once finished, you notify the server to index that page. Since it's just some simple
content display where most of the work was done by the backend, the JSTL approach still worked.

Besides that, there were only some trivial and uninteresting frontend pages generated by the JSTL
library.

### Adoption and Problems

When I got to Cornell during the orientation week, some orientation leaders introduced some sort of
time management skills. I was not interested by their pen-and-paper approach. I would prefer an app
approach that supported some sort of automation. I then quickly developed
[Scheduler](https://developersam.com/scheduler) and hosted it on my website.

A month later, I participated in [BigRed Hacks](https://www.bigredhacks.com/). We built
[ChunkReader](https://developersam.com/playground/chunk-reader), a service to extract key
information and summary from a given text. Again, it was an app with a complicated backend workflow
and a quite simple frontend display. It was built based on my JSTL library. It worked, but I was
already somewhat unsatisfied with it.

My JSTL library was based on a chain of complex inheritance relation, which was easy to design
initially but was hard to use and maintain on a sleepy hackathon night. It did provide server-side
rendering which is great, but we lost the ability to write HTML code with auto-completion in IDE.
What's more, it forced me to stick to it.

Here is a example showing how confusing it is:

```java
private void printSchedulerItemContent() throws JspException, IOException {
    CardTextBorderedTag cardTextTagForDeadline = new CardTextBorderedTag();
    cardTextTagForDeadline.setParent(this); // Comment: WHAT IS THIS?!
    cardTextTagForDeadline.setBodyContent("Deadline: " + schedulerItem.getDeadline());
    cardTextTagForDeadline.doTag();
    CardTextBorderedTag cardTextTagForDaysLeft = new CardTextBorderedTag();
    cardTextTagForDaysLeft.setParent(this);
    cardTextTagForDaysLeft.setBodyContent("Days Left: " + schedulerItem.getDaysLeft());
    cardTextTagForDaysLeft.doTag(); // Comment: What's the side effect?
}
```

I later tried to switch to the Spring Framework. It had a much better IDE support due to its
importance in the industry, but its annotation based configuration was very annoying to me and
significantly slowed on the startup time, which was critical for
[GAE](https://cloud.google.com/appengine/articles/spring_optimization). Despite my dislike for
Spring, I got a taste of what a web framework should be like.

In the final assignment of
[CS 2112](http://www.cs.cornell.edu/courses/cs2112/2017fa/), we were recommended to use
[SparkJava](http://sparkjava.com/){:target:"blank"} as our backend framework. This framework enabled
a declarative style of backend code with Java 8's newly added support for functional programming.
I believed I knew what _should_ be like for my website's architecture.

### The First Redesign

In the winter holidays, I had a relatively unsuccessful experience to develop my own web framework.
It finally replaced the old plain Servlet and provided support for functional programming, but the
design was still awkward.

Here is a weird, counter-intuitive example.

```kotlin
object SchedulerWriteItemService : StructuredInputService<SchedulerItemData>(
  inType = SchedulerItemData::class.java
) {
  override val uri: String = "/apis/scheduler/write"
  override val method: HttpMethod = HttpMethod.POST
  override fun output(input: SchedulerItemData): Boolean {
    return input.writeToDatabase()
  }
}
```

However, several important transitions had been made.

Firstly, I finally migrated my website’s legacy Java code to Kotlin. This is what enabled me to
write the simple library with ease by Kotlin’s expressive type system. It also gave me a hands-on
opportunity to learn the Kotlin language by concrete migration examples to demonstrate what’s
available in Kotlin. Kotlin’s insistence of internal instead of package-private visibility forced me
to gradually split my website’s code into modules.

Secondly, I started to use Gradle as the build tool instead of the IntelliJ configuration. It
implied a much consistent IDE importing experience directly from source code.

More importantly, I decided to use a modern frontend framework. Since I didn’t know the “correct”
way to write the frontend code that is scalable and maintainable, I chose Angular for its reputation
of being like Java and imposing a strict style. My initial implementation was quite sketchy, but the
overall structure remained the same under several re-structuring, thanks to Angular’s elegant design.

At the end of the winter holiday and the beginning of the new semester, I migrated the legacy Google
User’s API that is specific to App Engine to Firebase Auth that allowed the simple design of Single
Page Application that Angular enforced.

The frontend finally dropped the legacy JSTL and embrace the latest Angular stack, but the backend
still had a long path of modernization to go.

### Migration to Google App Engine Flex

App Engine introduced the Java 8 runtime about a year ago. I migrated to it and I observed a much
worse startup time that was almost unbearable. The issue was raised in a
[Google Groups](https://groups.google.com/forum/#!topic/google-appengine/b_k725q3Fog) but did not
get much response from Google. Also, there were not many exciting updates on App Engine in those
days. I felt that App Engine, especially the Java runtime, looked like an unloved child.

With the benefit of using whatever technology I would like, I started the migration to the flexible
runtime. I tried the [Vert.x](https://vertx.io/) stack, which supports the event-driven and
non-blocking model of the server. The migration was very painful: Google App Engine Standard and
Flex used different Datastore APIs, so almost all the database related code must be rewritten;
Vert.x enforced a non-blocking model, which created callback hell so all the REST API facing code
must be rewritten. These required changes effectively meant that all the backend code must be
rewritten!

Here is an example of a code snippet harmed by the callback hell:

```kotlin
// Comment: Awkward Consumer
fun getAllSchedulerItems(user: FirebaseUser, printer: Consumer<List<SchedulerItem>>) {
  val filterUser = PropertyFilter.eq("userEmail", user.email)
  val filterDeadline = PropertyFilter.ge("deadline", Timestamp.of(yesterday))
  val filter = filterUser and filterDeadline
  Database.query(kind = "SchedulerItem", filter = filter) { s ->
    // Comment: Extra Level of Indentation
    s.map(::SchedulerItem)
    .filter { it.totalHoursLeft >= 0 }
    .sorted()
    .toList()
    .consumeBy(consumer = printer)
  }
}
```

The migration led to a modern backend architecture, but a much worse code style due to the callback
hell introduced by Vert.x. During the spring hackathon, I got really angry with the callback hell
while figuring out the issue with the suddenly broken Firebase. I was determined to fix the issue
in the summer.

### Summer Update

#### Database

The summer update started with the database. During an internship where I had complete control to
develop a system for the client, I chose the Kotlin stack for backend. I noticed that JetBrains,
creator of Kotlin, had developed a SQL library [Exposed](https://github.com/JetBrains/Exposed). The
library supported type-safe operations on the database without much effort to awkwardly annotate the
classes and creating getters solely for the library. It was achieved solely by Kotlin's expressive
type system with little reflection.

Unfortunately, it did not support NoSQL database, such as Google Cloud Datastore. I studied the
source code of Exposed quite extensively. I found that most of the reflection used to adapt between
the JDBC layer and the type-safe layer; I also found that much of the usage of reflection was not
required to adapt to Google's Datastore. I quickly coded the prototype in a week and migrated all of
my website's database code to the new library, which I called
[TypedStore](https://github.com/SamChou19815/typed-store).

Here is the nice CRUD example copied from the GitHub repo's README:

```kotlin
// Create
val obj = FooEntity.insert {
  // You need to explicitly declare all the fields. Otherwise, it will throw an exception.
  table.bar gets "haha"
  // The second way of setting things
  this[FooTable.answer42] = 42
  // The type system ensures `this[BarTable.bar] = 42` is a compile time error.
}
// Read
val entities = FooEntity.query {
  // filter, order, and limit are all optional
  filter { table.answer42 eq 42 }
  order { table.answer42.desc() }
  withLimit(limit = 3)
}.toList()
// Update
val updated = FooEntity.update(entity = obj) { FooTable.bar gets "Oh, no!" }
// Delete
fun d() = FooEntity.delete(updated.key)
```

The library was field-tested with the new Scheduler app with the newly added auto-scheduling feature
and an RSS Reader I developed for myself and for future ML sources.

#### Backend and Frontend

I also discarded Vert.x and used SparkJava instead. I think running a little inefficiently is so
much better than the callback hell for my small personal website. I also introduced pac4j to the
codebase to deal with the security issue centrally. I wrote some adapters, implemented a simple
friend system based on Firebase Auth, and published that in a separate library, which I called
[KineticS](https://github.com/SamChou19815/kinetics).

Here is an example of the much better declaration for routes.

```kotlin
private fun initializeFriendSystemApiHandlers() {
  get(path = "/load") { FriendData(user = user) }
  get(path = "/get_user_info") {
    val email = queryParams("email") ?: badRequest()
    GoogleUser.getByEmail(email = email)
  }
  post(path = "/add_friend_request") {
    val key = queryParamsForKey("responder_user_key")
    val successful = FriendRequest.add(requester = user, responderUserKey = key)
    if (!successful) {
      badRequest()
    }
  }
  post(path = "/respond_friend_request") {
    val key = queryParamsForKey("requester_user_key")
    val approved = queryParams("approved")?.let { it == "true" } ?: badRequest()
    val successful = FriendRequest.respond(
      responder = user, requesterUserKey = key, approved = approved
    )
    if (!successful) {
      badRequest()
    }
  }
  delete(path = "/remove_friend") {
    val friendKey = queryParamsForKey("removed_friend_key")
    FriendPair.delete(firstUserKey = user.keyNotNull, secondUserKey = friendKey)
  }
}
```

The frontend code mostly remained the same with minor refactoring. A new homepage was introduced to
increase its attractiveness.

Here is how it looks like right now:

![Current Homepage](/img/2018-08-01-website-architecture-update/new.png)

You can visit the [homepage](https://developersam.com) to see the full page.

#### Infrastructure

App Engine Flex was good, but it was too expensive. Its lowest cost is about $40 a month if you want
your server to serve continuously, even if there were 0 visitors. With $1500 GCP credit won from the
fall hackathon, I can bear it for a while. However, the credit will expire in March next year and I
had to come up with _something_ to avoid paying \$40 a month for nothing.

In the summer holidays, I had the time so I was determined to lower the cost before the hard
deadline. I first switched to Google Compute Engine with the worst machine type f1-micro, which was
free in the always-free limit. Although I already containerized my app and deployed it on the
Compute Engine VM as a container, the deployment was very slow and caused 10 minutes of downtime at
least. In the case when I misconfigured something, it took me hours to correctly configure it and
sometimes forced me to stay up late to deal with the hardest problem in the world.

I later used Google's Cloud Balancer to dispatch frontend requests to Google Cloud Storage, which
almost reduced the frontend downtime to zero. However, the backend still had ten minutes to hours
of downtime and this was unacceptable.

About two weeks ago, I started the migration to Kubernetes. My backend part is already
containerized, and it only took me two to three hours to containerized my frontend. They were both
deployed to a single cluster in Google Kubernetes Engine, under two different workloads. Requests to
these two workloads are dispatched by Kubernetes' Ingress. In this week, I started to use the "real"
server-side rendering for the Angular app with Angular Universal and node.js server. This marks the
real start of running two languages on the same server for my website.

The screenshot below shows the Google Kubernetes Engine's setup:

![Website on k8s](/img/2018-08-01-website-architecture-update/k8s.png)

**The story ends here.**

### Planned Work for the Next Year (Sketch)

As you may see, my website is not only a portfolio. It is a mix of a portfolio, a place to
field-test my developed apps, and also a mirror of my knowledge of recent web development trends and
technology.

Since the website is now running well on Kubernetes Engine, the next step is CI/CD. I also want to
break up the monolith into microservices, when [Istio](https://istio.io/) becomes mature enough.

I would update the post when I get the work done. Stay tuned!