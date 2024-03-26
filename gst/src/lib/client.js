import Janus from "janus";



Janus.init({
    debug: true,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dependencies: Janus.useDefaultDependencies(),
    callback: function () {
        const janusRoom = new Janus(
            {
                server: "49.13.124.44",
                success: function () {
                    // Attach to VideoRoom plugin
                    janusRoom.attach(
                        {
                            plugin: "janus.plugin.videoroom",
                            opaqueId: opaqueId,
                            success: function (pluginHandle) {
                            }
                        })
                }
            })
    }
});